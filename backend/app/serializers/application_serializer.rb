class ApplicationSerializer
  def initialize(record)
    @record = record
  end

  def as_json(*)
    attributes
  end

  private

  attr_reader :record

  def attributes
    raise NotImplementedError, "#{self.class} must implement #attributes"
  end
end
