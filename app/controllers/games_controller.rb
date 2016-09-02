class GamesController < ApplicationController

  def create
    @game = Game.create({:state => params[:state]})
    binding.pry
    render json: @game, status: 201
  end

  def update
    binding.pry
    @game = Game.find(params[:id])
    if params[:game]
      @game.update(:state => params[:game][:state])
    else
      @game.update(:state => params[:state])
    end
    render json: @game
  end

  def index
    @games = Game.all
    render json: {games: @games}, :except => [:created_at, :updated_at]
  end

  private

  def game_params
    params.require(:game).permit(:state)
  end
end