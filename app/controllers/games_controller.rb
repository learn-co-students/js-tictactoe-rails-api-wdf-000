class GamesController < ApplicationController

  def index
    @games = {}
    @games['games'] = []
    Game.all.each do |game|
      @games['games'] << parse_ar(game)
      # @games << game.id
      # @games << game.state
    end
    # render plain: @games.select{|g| g}
    # @hash  = {
    #   "games"=>
    #     [{"id"=>1, "state"=>["X", "O", "", "", "", "", "", "", ""]},
    #     {"id"=>2, "state"=>["X", "O", "X", "", "", "", "", "", ""]}
    #   ]
    # }
    # @string = {"games"=>"hello"}

    render json: @games
    # binding.pry
    # render @games
  end

  def parse_ar(game)
    new_hash = {}
    new_hash['id'] = game.id
    new_hash['state'] = game.state
    new_hash
  end

  def create

    game = Game.new
    game.state = params["game"]["state"]
    game.save
    # binding.pry
  end

  def update
    # binding.pry
    game = Game.find(params[:id])
    game.state = params["game"]["state"]
    game.save
  end



end
