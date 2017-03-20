var boot = function(game){
	console.log("%cStarting my awesome game", "color:white; background:red");
};
  
boot.prototype = {
	preload: function(){
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
          //this.game.load.image("loading","assets/loading.png"); 
	},
  	create: function(){
		if(this.game.client.lock >= 1)
		{
			this.game.state.start("Preload");
		}
		//this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		//this.scale.pageAlignHorizontally = true;
		//this.scale.setScreenSize();

	}
}