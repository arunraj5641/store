from sklearn.base import RegressorMixin
from sklearn.linear_model import LinearRegression


class ForecastModelFactory:
    def create(self) -> RegressorMixin:
        return LinearRegression()
