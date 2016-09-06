class GamesController < ApplicationController

  def create
    @game = Game.new(game_params)
    if @game.save
      render json: @game, status: 201
    end
  end

  def update
    @game = Game.find(params[:id])
    if @game.update(game_params)
      render json: @game, status: 204
    end
  end

  def show
    @game = Game.find(params[:id])
    render json: @game, status: 200
  end

  def index
    @games = Game.all
    render json: @games
  end

  private

  def game_params
    params.require(:game).permit(:id, state: [])
  end


end
