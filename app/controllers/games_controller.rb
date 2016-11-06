class GamesController < ApplicationController

  def index
    games = Game.all
    render json: games, adapter: :json
  end

  def create
  end

  def update
  end

end
