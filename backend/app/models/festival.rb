class Festival < ApplicationRecord
  self.primary_key = "festival_id"

  has_many :forecasts,
           foreign_key: :festival_id,
           primary_key: :festival_id,
           dependent: :destroy

  validates :festival_name, presence: true
  validates :festival_date, presence: true
  validates :season, presence: true

  scope :upcoming, -> { where("festival_date >= ?", Date.current) }
end
