class SalesHistoryCsvImporter
  REQUIRED_HEADERS = %w[product_name sale_date quantity_sold].freeze

  ParsedCsv = Struct.new(:headers, :rows, :line_errors, keyword_init: true)
  ParsedRow = Struct.new(:row_number, :data, keyword_init: true)

  Result = Struct.new(:total_rows, :imported, :failed, :errors, :parse_error, keyword_init: true) do
    def summary
      {
        total_rows: total_rows,
        imported: imported,
        failed: failed
      }
    end

    def parse_error?
      parse_error.present?
    end
  end

  def initialize(user:, file:)
    @user = user
    @file = file
    @errors = []
    @imported = 0
    @total_rows = 0
    @products_by_name = user.products.to_a.index_by { |product| normalize(product.product_name) }
  end

  def call
    parsed_csv = parse_csv(file_contents)
    parsed_csv.line_errors.each { |row_error| add_line_error(row_error) }
    return invalid_headers_result(parsed_csv.headers) unless valid_headers?(parsed_csv.headers)

    parsed_csv.rows.each do |row|
      next if empty_row?(row.data)

      @total_rows += 1
      import_row(row.data, row.row_number)
    end

    result
  end

  private

  attr_reader :user, :file, :errors, :imported, :total_rows, :products_by_name

  def file_contents
    file.rewind if file.respond_to?(:rewind)
    file.respond_to?(:read) ? file.read : File.read(file)
  end

  def parse_csv(contents)
    headers = nil
    rows = []
    line_errors = []

    contents.each_line.with_index(1) do |line, row_number|
      fields, error_message = parse_csv_line(line.chomp)

      if headers.blank? && fields.all? { |field| field.to_s.strip.blank? }
        next
      elsif error_message.present?
        line_errors << { row: row_number, message: error_message }
        next
      elsif headers.blank?
        headers = fields.map { |field| field.to_s.strip }
        next
      elsif fields.size > headers.size
        line_errors << { row: row_number, message: "Invalid CSV row" }
        next
      end

      rows << ParsedRow.new(row_number: row_number, data: headers.zip(fields).to_h)
    end

    ParsedCsv.new(headers: headers || [], rows: rows, line_errors: line_errors)
  end

  def parse_csv_line(line)
    fields = []
    field = +""
    in_quotes = false
    index = 0

    while index < line.length
      character = line[index]

      if character == '"'
        if in_quotes && line[index + 1] == '"'
          field << '"'
          index += 1
        else
          in_quotes = !in_quotes
        end
      elsif character == "," && !in_quotes
        fields << field
        field = +""
      else
        field << character
      end

      index += 1
    end

    return [fields, "Invalid CSV row"] if in_quotes

    fields << field
    [fields, nil]
  end

  def valid_headers?(headers)
    missing_headers(headers).empty?
  end

  def invalid_headers_result(headers)
    parse_error_result(
      row: 1,
      message: "Missing required columns: #{missing_headers(headers).join(', ')}"
    )
  end

  def missing_headers(headers)
    REQUIRED_HEADERS - headers
  end

  def empty_row?(row)
    row.values.all? { |value| value.to_s.strip.blank? }
  end

  def import_row(row_data, row_number)
    row_data = normalized_row(row_data)
    product = product_for(row_data["product_name"])
    sale_date = parsed_date(row_data["sale_date"])
    quantity_sold = parsed_quantity(row_data["quantity_sold"])
    validation_errors = row_errors(row_data, product, sale_date, quantity_sold)

    return add_error(row_number, validation_errors.join(", ")) if validation_errors.any?

    sales_history = product.sales_histories.build(sale_date: sale_date, quantity_sold: quantity_sold)

    if sales_history.save
      @imported += 1
    else
      add_error(row_number, sales_history.errors.full_messages.to_sentence)
    end
  end

  def normalized_row(row_data)
    row_data.transform_keys { |key| key.to_s.strip }.transform_values { |value| value.to_s.strip }
  end

  def product_for(product_name)
    return if product_name.blank?

    products_by_name[normalize(product_name)]
  end

  def parsed_date(value)
    return if value.blank?

    Date.iso8601(value)
  rescue ArgumentError
    nil
  end

  def parsed_quantity(value)
    return if value.blank?
    return unless value.match?(/\A\d+\z/)

    value.to_i if value.to_i.positive?
  end

  def row_errors(row_data, product, sale_date, quantity_sold)
    errors = []
    errors << (row_data["product_name"].blank? ? "Product name is required" : "Product not found") if product.blank?
    errors << (row_data["sale_date"].blank? ? "Sale date is required" : "Invalid date") if sale_date.blank?
    errors << (row_data["quantity_sold"].blank? ? "Quantity sold is required" : "Invalid quantity") if quantity_sold.blank?
    errors
  end

  def add_error(row_number, message)
    @errors << { row: row_number, message: message }
  end

  def add_line_error(row_error)
    @total_rows += 1
    add_error(row_error[:row], row_error[:message])
  end

  def normalize(value)
    value.to_s.strip.downcase
  end

  def result(parse_error: nil)
    Result.new(
      total_rows: total_rows,
      imported: imported,
      failed: errors.size,
      errors: errors,
      parse_error: parse_error
    )
  end

  def parse_error_result(row:, message:)
    add_error(row, message)
    result(parse_error: message)
  end
end
