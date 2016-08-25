class GamesController < ApplicationController
  def index
    @games = Game.all
    #byebug
    render json: {:games => @games}, :except => [:created_at, :updated_at]
  end

  def show
    @game = Game.find(params[:id])
    render json: @game
  end

  def create
    # byebug
    game = Game.create({:state => params[:state]})
    render json: game, status: 201
  end

  def update
    game = Game.find(params[:id])
    if params[:game]
      game.update(state: params[:game][:state])
    else
      game.update(state: params[:state])
    end
    render json: game, status: 200
  end

  def check
    board = params[:state]
    combinations = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]
    # byebug
    winner = combinations.detect {|combo| board[combo[0]] != "" && board[combo[0]] == board[combo[1]] && board[combo[1]] == board[combo[2]] } ? true : false
    render json: winner, status: 200
  end
end
