class GamesController < ApplicationController





def new
  @game = Game.new
end



def index
  games = Game.all
  respond_to do |format|
    format.html {render :show}
    format.json {render json: games.to_json}
end

def create
  @game = Game.create(state: params["state"])

  render json: @game, status: 201
end


def show
  @game = Game.find_by(id: params[:id])
  respond_to |format|
  format.html {render "home/index"}
  format.json {render json: @game}
end
end


def edit
  @game = Game.find_by(id: params[:id])
end

def update
  @game = Game.find_by(id: params["id"])
  @game.update(state: params["state"])
end











end
