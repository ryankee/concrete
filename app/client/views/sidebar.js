Backbone.View.extend({
  template:_.template('<div></div>', this.model),
  render:function(){
    $(document.body).append(this.template());
  }
});
