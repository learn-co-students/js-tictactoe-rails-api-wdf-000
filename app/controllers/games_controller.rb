class GamesController < ApplicationController

  def index
    games = Game.all
    render json: games, adapter: :json
  end

  def show
    game = Game.find(params[:id])
    render json: game, adapter: :json
  end

  def create
    state = JSON.parse(game_params[:state]).values.slice(0..-2)
    game = Game.create(state: state)
    data = {"game": game.to_json}
    render json: data, status: 201
  end

  def update
    game = Game.find(params[:id])
    state = JSON.parse(game_params[:state]).values.slice(0..-2)
    game.update(state: state)
    render json: game, status: 200
  end

  private

  def game_params
    params.require(:game).permit(:state)
  end

end
