class HomeController < ApplicationController

  def index
    @game = Game.create(state: ["", "", "", "", "", "", "", "", ""])
  end

end
