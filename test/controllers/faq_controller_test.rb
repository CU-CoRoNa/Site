require 'test_helper'

class FaqControllerTest < ActionController::TestCase
  test "should get faq" do
    get :faq
    assert_response :success
  end

end
