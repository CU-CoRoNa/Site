FROM debian
MAINTAINER Nico Tonozzi <nico@nicot.us>

RUN apt-get update && apt-get install -y ruby ruby1.9.1-dev make libsqlite3-dev nginx build-essential
RUN gem install bundler
RUN gem uninstall libv8
RUN useradd -p '' -m rails
ADD . /home/rails/Site
WORKDIR /home/rails/Site
RUN /home/rails/Site/install
RUN chown -R rails:rails /home/rails
