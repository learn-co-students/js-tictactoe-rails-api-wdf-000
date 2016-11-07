class GamesController < ApplicationController

  def index
    games = Game.all
    # why is adapter: :json not adding root key?
    render json: games, adapter: :json
  end

  def show
    game = Game.find(params[:id])
    render json: game, adapter: :json
  end

  def create
    state = JSON.parse(game_params[:state]).values.slice(0..-2)
    game = Game.create(state: state)
    render json: game, status: 201
  end

  def update
    game = Game.find(params[:id])
    state = JSON.parse(game_params[:state]).values.slice(0..-2)
    game.update(state: state)
    render json: game, status: 200
  end

  private

  def game_params
    params.permit(:state)
  end

end
