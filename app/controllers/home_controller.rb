class HomeController < ApplicationController

  def index
    @game = Game.new
  end

end
