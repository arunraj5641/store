FROM ruby:3.4-slim

WORKDIR /rails

RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential libpq-dev postgresql-client && \
    rm -rf /var/lib/apt/lists/*

ENV BUNDLE_PATH=/usr/local/bundle

COPY Gemfile* ./
RUN bundle install

COPY . .

RUN chmod +x bin/docker-entrypoint

EXPOSE 3000

ENTRYPOINT ["bin/docker-entrypoint"]
CMD ["bin/rails", "server", "-b", "0.0.0.0", "-p", "3000"]
