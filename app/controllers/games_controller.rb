class GamesController < ApplicationController
  def index
    @games = Game.all
    render json: @games
  end

  def create
    # binding.pry
    @game = Game.create(game_params)
    render json: @game
  end

  def update
    # binding.pry
    @game = Game.find(params[:id]);
    @game.update(game_params);
    render :index
  end

  def game_params
    params.require(:game).permit(state:[])
  end
end
