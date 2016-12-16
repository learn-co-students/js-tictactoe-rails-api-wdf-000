class GamesController < ApplicationController

  def index
    games = Game.all

    render json: games
  end


  def create
    # game = Game.find(params[:id])
    game = Game.create(state: params[:state])
    redirect_to "/"
    # render plain: game.state
  end


  def update
    game = Game.find(params[:id])
    game.update(state: params[:state])
    # binding.pry
  end

  def board
    # binding.pry
    game = Game.find(params[:id])

    # binding.pry
    # render json: game.state
    render json: [game.state, game.id]
  end

end
