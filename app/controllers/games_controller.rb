class GamesController < ApplicationController

  def index
    games = Game.all
    render json: games, adapter: :json
  end

  def create
    state = JSON.parse(game_params[:state]).values.slice(0..-2)
    game = Game.create(state: state)
    render json: game, status: 201
  end

  def update
  end

  private

  def game_params
    params.permit(:state)
  end

end
