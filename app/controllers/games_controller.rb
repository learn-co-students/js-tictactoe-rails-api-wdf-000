class GamesController < ApplicationController

  def index
    @games = Game.all
    render json: @games
  end

  def show
    @game = Game.find(params[:id])
    render json: @game
  end

  def create
    @game = Game.create(state: params[:game][:state])
    render json: @game, status: 201
  end

  def update
    @game = Game.find(params[:id])
    @game.update(state: params[:game][:state])
    render json: @game
  end

  # private
  #
  # def game_params
  #   params.require(:game).permit(:state)
  # end to use this, need to have rails-generated forms

end
