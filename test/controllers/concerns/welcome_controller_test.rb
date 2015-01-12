require 'test_helper'

class Concerns::WelcomeControllerTest < ActionController::TestCase
  def setup
    @controller = WelcomeController.new
  end

  test "should get index" do
    get :index
    assert_response :success
  end

end
