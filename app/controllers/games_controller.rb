class GamesController < ApplicationController

  def index
  end

  def show
    @game = Game.find(params[:id])
    render json: @game, adapter: :json
  end

  def create
  end

  def update
  end

end
