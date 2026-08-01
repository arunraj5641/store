class RenameSalesHistoriesSalesIdToId < ActiveRecord::Migration[8.1]
  def up
    return unless table_exists?(:sales_histories)
    return if connection.primary_key(:sales_histories) == "id"

    rename_column :sales_histories, :sales_id, :id if column_exists?(:sales_histories, :sales_id)
  end

  def down
    return unless table_exists?(:sales_histories)
    return if column_exists?(:sales_histories, :sales_id)
    return unless legacy_sales_id_sequence?

    rename_column :sales_histories, :id, :sales_id if column_exists?(:sales_histories, :id)
  end

  private

  def legacy_sales_id_sequence?
    return false unless connection.adapter_name == "PostgreSQL"

    sequence_name = select_value("SELECT pg_get_serial_sequence('sales_histories', 'id')")
    sequence_name.to_s.end_with?("sales_histories_sales_id_seq")
  end
end
