class GamesController < ApplicationController
  def create
    @game = Game.create({state: params[:state]})
    render json: @game
  end

  def index
     @games = Game.all
     render json: @games
  end

  def new
     @game = Game.new
  end

  def show
    @game = Game.find(params[:id])
    render json: @game.to_json(only: [:id, :state])
  end

  def edit
  end

  def update
    @game = Game.find(params[:id])
    @game.update(state: params["state"])
  end

end
