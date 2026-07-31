class FestivalSerializer < ApplicationSerializer
  private

  def attributes
    {
      festival_id: record.festival_id,
      festival_name: record.festival_name,
      festival_date: record.festival_date,
      season: record.season
    }
  end
end
