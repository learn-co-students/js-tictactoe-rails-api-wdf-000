class GamesController < ApplicationController

  def index
    @games = Game.all
    # why is adapter: :json not adding root key?
    render json: @games, adapter: :json
  end

  def show
    @game = Game.find(params[:id])
    render json: @game, adapter: :json
  end

  def create
  end

  def update
  end

end
