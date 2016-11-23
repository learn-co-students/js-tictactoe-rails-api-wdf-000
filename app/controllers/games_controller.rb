class GamesController < ApplicationController
	before_action :set_game, only: [:update]

	def index
		@games = Game.all
		render json: {games: @games}, :except => [:created_at, :updated_at]
	end

	def create
		game = Game.create(state: game_state)
		render json: {game: game}
	end

	def update
		@game.update(state: game_state)
		render json: {game: @game}
	end


	private
	def game_state
		return new_state unless params['game']
		params['game']['state']
	end

	def new_state
		Array.new(9) { "" }
	end

	def set_game
		@game = Game.find(params[:id])
	end
end
