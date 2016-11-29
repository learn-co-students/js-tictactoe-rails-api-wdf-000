class GamesController < ApplicationController

  def index
    @games = Game.all
    respond_to do |format|
      format.json {render json: @games}
    end
  end

  def show
    @game = Game.find(params[:id])
    respond_to do |format|
      format.json {render json: @game}
    end
  end

  def create
    prev_game = params["game"].to_s
  game = Game.create(state: prev_game)
  respond_to do |format|
    format.json {render json: game}
  end
  end

  def update
    game = Game.find(params[:id])
    game.update(game_params)
    game.state = game.state.split(',')
    game.save
  end

end
