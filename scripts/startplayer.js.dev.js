﻿function StartMediaPlayer(parentId, xamlSource, playerWidth, playerHeight) {

	this._hostname = ExpressionPlayer.Player._getUniqueName("xamlHost");
	Silverlight.createObjectEx( {   source: xamlSource, 
									parentElement: $get( parentId || "mediaPlayer_0" ), 
									id: this._hostname, 
									properties: { width: playerWidth, height: playerHeight, version:'1.0', background:"Black", isWindowless:'true', inplaceInstallPrompt:true }, 
									events: { onLoad:Function.createDelegate(this, this._handleLoad) } } );   
}

StartMediaPlayer.prototype= {
	_handleLoad: function() {
		this._player = $create(   ExtendedPlayer.Player, 
								{ // properties
									autoPlay        	: this.autoPlayParam, 
									autoLoad        	: this.autoLoadParam,
									scaleMode 	    	: 1,
									watermarkSource		: this.watermarkSource,
									watermarkPosition	: this.watermarkPosition,
									watermarkOpacity	: this.watermarkOpacity,
									muted           	: this.mutedParam,
									enableCaptions  	: true,
									volume          	: 1.0
								}, 
								{ // event handlers
									mediaOpened: Function.createDelegate(this, this._onMediaOpened),
									mediaEnded: Function.createDelegate(this, this._onMediaEnded),
									mediaFailed: Function.createDelegate(this, this._onMediaFailed)
								},
								null, $get(this._hostname)  );   

	this.watermarkSource = "";
	this.watermarkPosition = 4;
	this.watermarkOpacity = 1;
	this._playlist = this.getPlaylist();
	this._player.set_mediainfo( this._playlist[0] );
	},
	
	_onMediaOpened: function(sender, eventArgs){
		this._logMediaStatus(1);
	},
	
	_onMediaEnded: function(sender, eventArgs) {
		this._logMediaStatus(2);
	},
	
	_onMediaFailed: function(sender, eventArgs) {
		alert(String.format( Sys.UI.Silverlight.MediaRes.mediaFailed, this._player.get_mediaSource() ) );
	},
		
	_logMediaStatus: function(status){
		jQuery.ajax({type: 'GET', url: this.ajaxUrl, data: 'pid=' + this.postId + '&stat=' + status + '&file=' + encodeURIComponent(this._playlist[0].mediaSource), cache: false});		
	}
}

function StartWithParent(parentId, appId) {
	new StartMediaPlayer(parentId);
}

// strings used in scripts

Sys.UI.Silverlight.ControlRes={
'runtimeErrorWithoutPosition': "Runtime error {2} in control '{0}', method {6}: {3}",
'scaleModeRequiresMatrixTransform': "When ScaleMode is set to zoom or stretch, the root Canvas must have not have a RenderTransform applied, or must only have a ScaleTransform.",
'mediaError_NotFound': "Media '{3}' in control '{0}' could not be found.",
'runtimeErrorWithPosition': "Runtime error {2} in control '{0}', method {6} (line {4}, col {5}): {3}",
'silverlightVersionFormat': "Must be in the format 'MajorVersion.MinorVersion'.",
'otherError': "{1} error #{2} in control '{0}': {3}",
'cannotChangeSource': "You cannot change the XAML source after initialization.",
'parserError': "Invalid XAML for control '{0}'. [{7}] (line {4}, col {5}): {3}",
'sourceAlreadySet': "You cannot change the XAML source after initialization.",
'parentNotFound' : "{1} error #{2} in control '{0}': {3}"
};

Sys.UI.Silverlight.MediaRes={
'volumeRange':  "Volume must be a number greater than or equal to 0 and less than or equal to 1.",
'mediaFailed':  "Unable to load media '{0}'. This may be because there is no such file at this location or the video file is encoded incorrectly.",
'noMediaElement':  "The XAML document does not contain a media element.",
'noThumbElement': "{1} error #{2} in control '{0}': {3}",
'invalidChapter':  "Must be greater than or equal to 0 and less than the length of the chapter's array.",
'silverlightNotLoaded': "{1} error #{2} in control '{0}': {3}"
};