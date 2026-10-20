FROM node:24-bookworm-slim AS assets

WORKDIR /app
COPY . .
RUN npm install && npm run build

FROM php:8.3-cli-bookworm

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        git \
        unzip \
        libzip-dev \
        libpq-dev \
        ca-certificates \
    && docker-php-ext-install pdo_mysql pdo_pgsql zip \
    && apt-get purge -y --auto-remove $PHPIZE_DEPS \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

COPY composer.json composer.lock ./
RUN composer install \
    --no-dev \
    --no-interaction \
    --prefer-dist \
    --optimize-autoloader \
    --no-scripts

COPY . .
COPY --from=assets /app/public/build ./public/build

RUN composer dump-autoload --no-dev --optimize

COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["docker-entrypoint.sh"]
