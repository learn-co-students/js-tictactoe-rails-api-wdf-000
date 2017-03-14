class GamesController < ApplicationController

  def index
    @games = Game.all
    render json: {games: @games}, except: [:created_at, :updated_at]
  end

  def create
    @game = Game.create(state: params[:game][:state])
    render json: @game
  end

  def show
    @game = Game.find(params[:id])
    render json: {game: @game}, except: [:created_at, :updated_at]
  end

  def update
    @game = Game.find(params[:id])
    @game.update(state: params[:game][:state])
    render json: @game
  end
end
