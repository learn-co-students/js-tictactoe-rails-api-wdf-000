class GamesController < ApplicationController
  def create
    game  = Game.new(game_params)
    if game.save 
      render json: game, status: 200
    else
      render plain: game.errors.to_json, status: 520 
    end
  end

  def update
    game = Game.find(params[:id])
    game.update(game_params)
    render json: game, status: 200
  end

  def index
    render json: Game.all
  end

  private

  def game_params
    params.require(:game).permit(state: [])
  end
end
