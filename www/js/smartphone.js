var isGallery=0,isiOS7=false,mql;
$(document).ready(function(){
    if(MobileEsp.isTierIphone){
        ($('#maingallery').length) ? isGallery=1 : isGallery=0;
        var start_orientation=window.orientation;
        $('body').append('<div id="orientation"><img src="/dg/fashion-show/img/shared/turn_device.png"></div>');
        
        if(start_orientation!==0&&isInternetAndroid&&isGallery==1){
                    showOrientationMessage(start_orientation);    
        }
        
        var supportsOrientationChange = "onorientationchange" in window,
        orientationEvent = supportsOrientationChange ? "orientationchange" : "resize";

        window.addEventListener(orientationEvent, function() {
            window.setTimeout(function(){
                mql = window.matchMedia("(orientation: portrait)");
                handleOrientationChange(window.orientation);
            },500);     
        }, false);
    }





});

function showOrientationMessage(orientation){
    var avalH=0;
    var ratio=window.devicePixelRatio;
    if(mql.matches){
        //portrait
        $('#orientation').hide();
    } else {
        avalH = (screen.width / ratio) + 20;
        $('#orientation').show().css({height: avalH});
    }
}

function handleOrientationChange(orientation) {
    if (isInternetAndroid&&isGallery==1) {
        showOrientationMessage(orientation);
        return;
    }


    var jwh=$(window).height();
    var $cntimgz=$("#zoom-sp");
    var avalH=0;
    var ratio=window.devicePixelRatio;
    if(mql.matches){
      //portrait
    avalH=jwh+deviceAddressBar;
  }else {
      //landscape
          avalH=jwh+deviceAddressBar;
      }
    $cntimgz.css({height:avalH});
    hideURLbar();

  }

var videoPage_sp = {
    init : function(){
        var $this=this;
        $this.buildVideo();
        $this.setvideoshare();
    },
    buildVideo : function(){
        var srcVideo = $('video.video-inpage').find('source').attr('src');
        gap_datalayer.track_video(srcVideo);
        var ytiframe = '<iframe width="100%" height="auto" src="http://www.youtube.com/embed/' + srcVideo + '?rel=0&showinfo=0" frameborder="0" allowfullscreen></iframe>';
        var htmlVideo = '<div id="video-inpage"><div id="vinp_wrapper">' + ytiframe + '</div>' +
            '<div id="btns-share-vinp" class="btns-share"><a class="fb" href="#"><span>Facebook</span></a><a class="tw" href="#"><span>Twitter</span></a>' +
            '<a class="tumblr" href="#"><span>Tumblr</span></a><a class="pi" href="#"><span>Tumblr</span></a><a class="gplus" href="#"><span>Tumblr</span></a></div>' +
            '</div>';
        $('#body').html(htmlVideo);
    },
    setvideoshare : function(){
        $('#btns-share-vinp').on('click', 'a', function () {
            var $btn = $(this);
            var elType = $btn.attr('class');
                social.seturl(elType, 'video', function (shareUrl) {
                    //fakelink solo per trigger click
                    if (isiOS7 && elType == 'tw') {
                        location.assign(shareUrl);
                    } else {
                        $('#btns-share-vinp').append('<a style="display:none" id="fakelink" href="' + shareUrl + '" target="_blank">&nbsp;</a>');
                        sendSharedEls();
                    }
                });
        });
    }
}

function sendSharedEls(){
   var fireOnThis = document.getElementById("fakelink");

  if(document.createEvent){
      var evt = document.createEvent("MouseEvents");
      evt.initEvent("click", true, true);
      fireOnThis.dispatchEvent(evt);
  }else if(document.createEventObject){
      var evObj = document.createEventObject();
     fireOnThis.fireEvent("onclick", evObj);
  }

    $('#fakelink').remove();
}




var social={
    isPress : 0,
    hostdomain : '',
    seturl : function(type,imgid,callback){
        var $this=this;
        $this.hostdomain='http://'+location.hostname;
        $this.checkIfPress();
        var socialName='';

        switch (type){
            case 'fb':
            socialName="facebook";
            $this.fb(imgid,callback);
            break;
            case 'gplus':
            socialName="google plus";
            $this.gplus(imgid,callback)
            break;
            case 'tw':
            socialName="twitter";
            $this.tw(imgid,callback)
            break;
            case 'tumblr':
                socialName="tumblr";
                $this.tumblr(imgid,callback)
            break;
            case 'pi':
                socialName="pinteres";
            $this.pint(imgid,callback)
            break;
        }

    },
    fb: function (imgid,callback) {
        var $this=this;
        var txt_section='',pageUrl='',imgUrl='';
        (!mq_sp) ? txt_section = nav.data_section : txt_section = $('body').attr('data-section');

        var meta = new JsonTmplHelper(settings.meta, lang);
        var imgandurl=$this.getImgPathFB(imgid);
        var arrImgAndUrl=imgandurl.split('|');

        if(imgid == 'video'){
            var arrSection = txt_section.split('_');
            txt_section = arrSection[0] + '_video_' + arrSection[2];
            pageUrl = settings.val("www_root") + settings.val("sections_url." + txt_section);
        }else{
            pageUrl=arrImgAndUrl[1];
        }

        var titleShare=encodeURIComponent(meta.val(txt_section + ".title"));
        var descriptionShare=encodeURIComponent(meta.val(txt_section + ".description"));

        var name=encodeURIComponent("Dolce&Gabbana");

        var redirectUrl=settings.val("www_root") + settings.val("sections_url." + nav.data_section);

        var shareString = "https://www.facebook.com/dialog/feed?" +
            "app_id="+shareAppID+"&" +
            "link="+pageUrl+"&" +
            "picture="+arrImgAndUrl[0]+"&" +
            "name="+name+"&" +
            "caption="+titleShare+"&" +
            "description="+descriptionShare+"&" +
            "redirect_uri="+redirectUrl;
        gap_datalayer.social_share('facebook',shareString);
        callback(shareString);
    },
    gplus: function (imgid,callback) {
        var $this=this;
        var txt_section='';
        (!mq_sp) ? txt_section = nav.data_section : txt_section = $('body').attr('data-section');

        if ($this.isPress) {
            var url = location.href;
        } else {
            if(imgid!='video'){
                if(!mq_sp){
                    var url = location.href + "photo-" + (imgid)+"/";
                }else{
                    var url = location.href + "photo-" + (imgid)+"/";
                }

            }else{

                var arrSection = txt_section.split('_');
                txt_section = arrSection[0] + '_video_' + arrSection[2];
                var url = settings.val("www_root") + settings.val("sections_url." + txt_section);
            }
        }
        var shareString = "https://plus.google.com/share?url=" + encodeURIComponent(url);
        gap_datalayer.social_share('googleplus',shareString);
        callback(shareString);
    },
    tw : function(imgid,callback){
        var $this=this;
        var url='';
        var txt_section='';
        (!mq_sp) ? txt_section = nav.data_section : txt_section = $('body').attr('data-section');

        if ($this.isPress) {
            url = location.href;
        } else {
            if(imgid!='video'){
                if (!mq_sp) {
                    var url = location.href + "photo-" + (imgid) + "/";
                } else {
                    var url = location.href + "photo-" + (imgid) + "/";
                }
            }else{
                var arrSection = txt_section.split('_');
                txt_section = arrSection[0] + '_video_' + arrSection[2];
                var url = settings.val("www_root") + settings.val("sections_url." + txt_section);
                }
        }

        var bitly_url = 'https://api-ssl.bitly.com/v3/shorten?access_token=313ad38c45e683bd0121e27cdafe2e0222f7c958&longUrl=' + encodeURIComponent(url);
        $.ajax({
            dataType: 'jsonp',
            url: bitly_url,
            success: function (data) {
                var databitly=data;
                //console.log("data-%o", data);
                var meta = new JsonTmplHelper(settings.meta, lang);

                var textshare=meta.val(txt_section + ".title")+ ' @dolcegabbana ';
                var textToShare=encodeURIComponent(textshare);
                var linkToShare=encodeURIComponent(databitly.data.url);
                var bitlyString = "https://twitter.com/intent/tweet?text="+textToShare+" %2d "+linkToShare;
                gap_datalayer.social_share('twitter',bitlyString);
                callback(bitlyString);
            },
            error: function (xhr, ajaxOptions) {
                log('Error connecting to Bitly')
            }
        });
    },
    tumblr : function(imgid,callback){
        var $this=this;
        var txt_section='';
        (!mq_sp) ? txt_section=nav.data_section : txt_section=$('body').attr('data-section');
        if ($this.isPress) {

                var url = location.href;

        } else {
            if(imgid!='video'){
                if (!mq_sp) {
                    var url = location.href + "photo-" + (imgid) + "/";
                } else {
                    var url = location.href + "photo-" + (imgid) + "/";
                }
            }else{
                var arrSection = txt_section.split('_');
                txt_section = arrSection[0] + '_video_' + arrSection[2];
                var url = settings.val("www_root") + settings.val("sections_url." + txt_section)
            }

        }
        //var textshare=settings.meta.items[$this.getSectionIndex()].title.textBlocks[lang];

        var meta = new JsonTmplHelper(settings.meta, lang);

        var textshare=meta.val(txt_section + ".title");
        var shareString = "http://www.tumblr.com/share/link?url= " + encodeURIComponent(url) + "&name=" + encodeURIComponent(textshare);
        gap_datalayer.social_share('tumblr',shareString);
        callback(shareString);
    },
    pint : function(imgid,callback){
        var $this=this;
        var txt_section='';
        (!mq_sp) ? txt_section=nav.data_section : txt_section=$('body').attr('data-section');
        if ($this.isPress) {
            if(imgid!='video'){
                var url = location.href;
                var coverVideoSrc=$('#pic-press').attr('src');
                var imgUrl=$this.hostdomain+coverVideoSrc;
            }else{
                var arrSection=txt_section.split('_');

                if($('#press-video-toggler').length){
                    //video aperto da download
                    var ytcode =$('#press-video-toggler').attr('data-pathmp4');
                    var imgUrl = 'http://img.youtube.com/vi/' + ytcode + '/0.jpg';
                }else{
                    //video aperto url diretta
                    var YTurl = $('meta[property="og:video"]').attr('content');
                    var YTarray = YTurl.split('/');
                    var arrLen = YTarray.length;
                    var ytcode = YTarray[arrLen - 1];
                    var imgUrl = 'http://img.youtube.com/vi/' + ytcode + '/0.jpg';
                }

                txt_section=arrSection[0]+'_video_'+arrSection[2];
                var url=settings.val("www_root") + settings.val("sections_url."  + txt_section)
            }
        }
        else{
            //imgid-1: mantiene corrispondenza tra id e posizione in json dopo drop video
            if(imgid!='video'){
                if (!mq_sp) {
                    var imgUrl = $this.getimgUrl(parseInt(imgid)-1);
                    var url = location.href + "photo-" + (parseInt(imgid))+"/";
                } else {
                    var imgUrl = $this.getimgUrl(parseInt(imgid));
                    var url = location.href + "photo-" + (parseInt(imgid))+"/";
                }


            }else{
                if(runway.videoItem!=''){
                    var ytcode=runway.videoItem.video_url_flv;
                }else{
                    //sono su url secca di video e non c'è json con dati. prendo url video da OG:VIDEO
                   var YTurl=$('meta[property="og:video"]').attr('content');
                   var YTarray=YTurl.split('/');
                   var arrLen=YTarray.length;
                   var ytcode=YTarray[arrLen-1];
                }

                var imgUrl=  'http://img.youtube.com/vi/'+ytcode+'/0.jpg';

                var arrSection=txt_section.split('_');
                txt_section=arrSection[0]+'_video_'+arrSection[2];
                var url=settings.val("www_root") + settings.val("sections_url."  + txt_section)

            }
            if (!/http:\/\//.test(imgUrl)) {
                imgUrl = $this.hostdomain + imgUrl;
            }
        }

        var meta = new JsonTmplHelper(settings.meta, lang);

        var textshare=meta.val(txt_section + ".title");
        var shareString = "http://pinterest.com/pin/create/button/?url=" + encodeURIComponent(url) + "&media=" + encodeURIComponent(imgUrl) + "&description=" + encodeURIComponent(textshare);
        gap_datalayer.social_share('pinterest',shareString);
        callback(shareString);
    },
    getSectionIndex : function(){
        var section_index=0;
        var txt_section='';
        var items=settings.meta.items;
        (!mq_sp) ? txt_section=nav.data_section : txt_section=$('body').attr('data-section');

        for(i=0;i<items.length;i++){
            if(items[i].id==txt_section){
                section_index=i;
            }
        }
        return section_index;
    },
    getimgUrl : function(index){
        var imgUrl='';
        if(!mq_sp){

            if (runway.jsonitems != undefined) {
                imgUrl = runway.jsonitems[index].picture_medium.path;
            }
        } else {
            imgUrl = runway_sp.jsonitems[runway_sp.currSlide].picture_medium.path;
        }
        return imgUrl;
    },
    checkIfPress : function(){
        var $this=this;
        var elPress=0;
        if(!mq_sp){
            if (nav.data_section == 'press_download_woman' || nav.data_section == 'press_download_man') {
                elPress = 1;
            } else if (nav.data_section == 'press_video_woman' || nav.data_section == 'press_video_man') {
                elPress = 1;
            }
        }else{
            //get section from page
            var dataSection=$('body').attr('data-section');
            if (dataSection == 'press_download_woman' || dataSection == 'press_download_man') {
                elPress = 1;
            } else if (dataSection == 'press_video_woman' || dataSection == 'press_video_man') {
                elPress = 1;
            }
        }
        $this.isPress=elPress;
    },
    getImgPathFB : function(imgid){
        var $this=this;
        var txt_section='',imgUrl='',title='';
             (!mq_sp) ? txt_section=nav.data_section : txt_section=$('body').attr('data-section');

             if ($this.isPress) {

                 //SEZIONE PRESS

                 if(imgid!='video'){
                     var url = location.href;
                     var coverVideoSrc=$('#pic-press').attr('src');
                     var imgUrl=$this.hostdomain+coverVideoSrc;
                 }else{
                     var arrSection=txt_section.split('_');

                     if($('#press-video-toggler').length){
                         //video aperto da download
                         var ytcode =$('#press-video-toggler').attr('data-pathmp4');
                         imgUrl = 'http://img.youtube.com/vi/' + ytcode + '/0.jpg';
                     }else{
                         //video aperto url diretta
                         var YTurl = $('meta[property="og:video"]').attr('content');
                         var YTarray = YTurl.split('/');
                         var arrLen = YTarray.length;
                         var ytcode = YTarray[arrLen - 1];
                         imgUrl = 'http://img.youtube.com/vi/' + ytcode + '/0.jpg';
                     }

                     txt_section=arrSection[0]+'_video_'+arrSection[2];
                     url=settings.val("www_root") + settings.val("sections_url."  + txt_section)
                 }
             }
             else{
                  //GALLERIES
                 //imgid-1: mantiene corrispondenza tra id e posizione in json dopo drop video
                 if(imgid!='video'){
                     if (!mq_sp) {
                         imgUrl = $this.getimgUrl(parseInt(imgid)-1);
                         url = location.href + "photo-" + (parseInt(imgid))+"/";
                     } else {
                         imgUrl = $this.getimgUrl(parseInt(imgid));
                         url = location.href + "photo-" + (parseInt(imgid))+"/";
                     }


                 }else{
                     if(runway.videoItem!=''){
                         imgUrl=runway.videoItem.picture_thumb;
                     }else{
                         //sono su url secca di video e non c'è json con dati. prendo url video da OG:VIDEO
                        var YTurl=$('meta[property="og:video"]').attr('content');
                        var YTarray=YTurl.split('/');
                        var arrLen=YTarray.length;
                        var ytcode=YTarray[arrLen-1];
                        imgUrl=  'http://img.youtube.com/vi/'+ytcode+'/0.jpg';
                     }

                     var arrSection=txt_section.split('_');
                     txt_section=arrSection[0]+'_video_'+arrSection[2];
                     url=settings.val("www_root") + settings.val("sections_url."  + txt_section)

                 }
                 if (!/http:\/\//.test(imgUrl)) {
                     imgUrl = $this.hostdomain + imgUrl;
                 }
             }
        return imgUrl+'|'+url;

    }

}






function hideURLbar() {
	if (window.location.hash.indexOf('#') == -1) {
		window.scrollTo(0, 1);
	}
}

function followus(){
    var $fu=$('.followus ul');
    $fu.css({height:0});
        $('.followus span').eq(0).hammer().on("tap", function(ev) {

        if($fu.data('status')=='open'){
            $('.ico-underline-divider').removeClass('on');
            $fu.animate({height: 0}, 300, function () {
                $fu.data('status', 'close').removeClass().addClass('close');
                });
            $fu.find('li').fadeTo(200,0);
        }else{
            $('.ico-underline-divider').addClass('on');
            $fu.removeClass().addClass('open').animate({height: 115}, 300, function(){
                $fu.data('status', 'open');
                   });
            $fu.find('li').fadeTo(200,1);
        }
    });
}

//util loading thumbs
var lt={
    isloading : false,
    $lb : null,
    init : function(){
        var $this=this;
        $this.watchthumbs();
        //$('#filterby').append('<div id="loading_bar"></div>');
        //$this.$lb=$('#loading_bar');
    },
    watchthumbs :  function(){
        var $this=this;
        $this.isloading=true;
        var $thumbs = $('#container-thumbs .tbfi');
        $thumbs.imagesLoaded({
            always: function () {
                $this.hide();
                window.setTimeout(function(){
                    $this.showthumbs($thumbs)
                },1000);
            },
            progress: function (isBroken, $images, $proper, $broken) {
                var tot = $proper.length + $broken.length;
                var els = $images.length
                $this.update(tot, els);
            }
        });
    },
    update : function(tot,els){
        var $this=this;
        var gap=(100/els);
        var incr=tot*gap;
        //console.log(incr+'%')
        //$this.$lb.css({width:incr+'%'});
    },
    hide : function(){
        //$('#loading_bar').fadeOut('slow');
    },
    showthumbs : function(els){
        var $this=this;
        var $img=$(els).eq(0);
        $img.fadeTo(350, 1, function () {
            $img.removeClass('tbfi');
            if (els.length == 1) {
                //terminato fadeIn elementi filtrati
                $('#ico-loading-is').css({display:'none'});
                $('#maingallery').css({marginBottom:0});
                lt.isloading=false;
            }
            $this.showthumbs($(els).slice(1));
        });
    }
}


var view_show;
var runway_sp = {
    isFullVisible : 0,
    isShareVisible : 0,
    isDetailOpen : 0,
    jsonUrl : '',
    jsonitems : '',
    maxels : 10,
    addedThumbs : 0,
    init : function(){
        var $this=this;
        $this.setUrlData();
        $this.get_data();
        $this.set_events();
    },
    setUrlData : function(){
     var $this=this;
     var currDataSection=$('body').attr('data-section');
     var $links=$('#main_menu').find('.main-nav-colsx a');
     $links.each(function(i){
         elDataSection=$(this).attr('data-section');
         if(elDataSection==currDataSection){
                 $this.jsonUrl=$(this).attr('data-xmlurl');
         }
     });
    },
    get_data : function(){
        var $this=this;
        $.ajax({
            dataType: 'JSON',
            url: $this.jsonUrl,
            success: function (data) {
                //console.log("data-%o", data);
                $this.jsonitems=data.items;
                $this.create_gallery();
            },
            error: function (xhr, ajaxOptions) {
            }
        });
    },
    set_events : function(){
        var $this=this;
        $('#container-thumbs').on('click','div.thumb', function (e) {
            e.preventDefault();
            $this.currSlide=Math.round($(this).attr('data-index'));
            if(!$(this).hasClass('video')){
                $this.showdetail();
            }
            /*else{
                var videoUrl=$(this).attr('data-url');
                location.assign("http://www.youtube.com/watch?v="+videoUrl);
            }*/
        });

        //btn open share panel
        $('#open-zmt-sp').on('click', function (e) {
            e.preventDefault();
            $(this).removeClass().addClass('hiding');
            $('#zm-tools-sp').addClass('on');
            $('#close-zm-sp').removeClass().addClass('on');
            $this.isShareVisible = 1;
        });

        //btn close share panel
        $('#close-zm-sp').on('click', function (e) {
            e.preventDefault();
            $(this).addClass('closing');
            window.setTimeout(function () {
                $('#zm-tools-sp').removeClass();
                $('#open-zmt-sp').removeClass().addClass('on');
                $this.isShareVisible = 0;
            }, 400);

        });

        $('#pinch-zoom-sp').on('click', function (e) {
            e.preventDefault();
            $(this).removeClass().addClass('hiding');
            $('#zm-tools-sp').removeClass();
            $('#open-zmt-sp').removeClass().addClass('hiding');
            $('#close-zoom-sp').removeClass().addClass('rotateout onfull');
            window.setTimeout(function () {
                $this.setfullimg();
            }, 300);
        });

        //share events galleries
        $('#share-zm-sp').on('click','a',function(e){
            var $btn = $(this);
            var elType = $btn.attr('class');
            if ($btn.attr('href') == '#') {
                e.preventDefault();
                var imgId=$this.jsonitems[$this.currSlide].id;
                social.seturl(elType, imgId, function (shareUrl) {
                    //fakelink solo per trigger click
                    if(isiOS7&&elType=='tw'){
                        location.assign(shareUrl);
                    }else{
                        $('body').append('<a style="display:none" id="fakelink" href="'+shareUrl+'" target="_blank">&nbsp;</a>');
                        sendSharedEls();
                    }

                });
            }
        });



        var $ftr = $("footer");
        var $lt = $("#layout");

        $('#close-zoom-sp').on('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            if ($this.isFullVisible) {
                $(this).removeClass().addClass('rotatein');
                $('#wrp-full-sp').hide();
                $('#wrp-zoom-sp').show();
                $('#pinch-zoom-sp').removeClass().addClass('on');
                $('#open-zmt-sp').removeClass().addClass('on');
                $this.removefullimg();
                $this.isFullVisible = 0;
            } else {
                $(this).removeClass().addClass('closing');
                $('#pinch-zoom-sp').removeClass().addClass('closing');
                $('#zm-tools-sp').removeClass();
                $('#open-zmt-sp').removeClass().addClass('on');
                $this.isShareVisible = 0;
                $this.isFullVisible = 0;

                $lt.show();
                $ftr.show();
                $('#sp_fdr').remove();
                window.setTimeout(function () {
                    $this.closedetail();
                }, 450);
            }
        });
    },
    create_gallery : function(){
        var $this=this;
        var domain=currdomain;
        $this.elsGallery=$this.jsonitems.length;
        var htmlthumb='',imgsrc='',el=null;
        var $picscontainer=$('#container-thumbs');
        $('#detail').remove();
        $picscontainer.html('').css({visibility:'visible'});
        var i;
        for(i=0;i<$this.maxels;i++){
            el=$this.jsonitems[i];
            var elType=el.id;
            if(elType=='video'){
                /*
                //ELIMINATA ICONA VIDEO. IL VIDEO E' ACCESSIBILE SOLO DA MENU. PER I VIDEO DG VUOLE CHE CI SIA PAGINA E URL DEDICATA E NON SEMPLICE OVERLAY O RIMANDO A PLAYER
                imgsrc=domain+''+el.picture_thumb.path;
                videourl=el.video_url_mp4.textBlocks.en;
                htmlthumb+='<div class="thumb tbfi video" data-index="video" data-url="'+videourl+'">' +
                    '<a href="http://www.youtube.com/watch?v=' + videourl + '?rel=0&showinfo=0"><img src="'+imgsrc+'" class="picthumb"></a><span class="icons ico-play"></span>' +
                    '</div>';
                */
                $this.jsonitems.splice(i,1);
                $this.elsGallery=$this.jsonitems.length;
                i=i-1;
            }else{
                imgsrc=domain+''+el.picture_thumb.path;
                htmlthumb+='<div class="thumb tbfi" data-index="'+i+'"><a href="#"><img src="'+imgsrc+'" class="picthumb"></a></div>';
            }

        }//close for
        //console.log("%o", $this.jsonitems);

        $this.addedThumbs=$this.maxels;
        $picscontainer.append(htmlthumb);
        $('#maingallery').append('<span id="ico-loading-is" class="ui-icon ui-icon-loading spin"></span>');
        $('#ico-loading-is').css({display:'block'});
        lt.init();
        $this.infinitescroll();
    },
    infinitescroll : function(){
        var $this=this;
        var $picscontainer=$('#maingallery');
        $picscontainer.infiniteScroll({
        	threshold: 150,
        	onEnd: function() {
        		//console.log('No more results!');
        	},
        	onBottom: function(callback) {
                var moreResults = true;
                $this.addthumbs();
                if($this.addedThumbs<$this.elsGallery){
                    callback(moreResults);
                }


        	}
        });

    },
    addthumbs : function(){
        if(lt.isloading) return;
        var $this=this;
        var domain=currdomain;
        var $picscontainer=$('#container-thumbs');
        var $maingallery=$('#maingallery');
        $maingallery.css({marginBottom:'50px'});
        $('#ico-loading-is').css({display:'block'});

        var htmlthumb='',imgsrc='',el=null;
        var k=$this.addedThumbs;
        var thumbset=$this.maxels+$this.addedThumbs;
        if(thumbset>=$this.elsGallery){
            //quello che resta da caricare rispetto ad array totale
            thumbset=$this.elsGallery;
        }
        for(k;k<thumbset;k++){
            el = $this.jsonitems[k];
            imgsrc = domain + '' + el.picture_thumb.path;
            htmlthumb += '<div class="thumb tbfi" data-index="' + k + '"><a href="#"><img src="' + imgsrc + '" class="picthumb"></a></div>';

        }
        $picscontainer.append(htmlthumb);
        lt.watchthumbs();
        $this.addedThumbs=thumbset;

    },
    showdetail : function(){
      var $this=this;
        if(MobileEsp.uagent.search('os 7_0')){
            isiOS7=true;
        }

      //slide medium

      $this.slide_pics();
      var tmlayout,tmzoom,avalH;

      if (isInternetAndroid) {
          var ratio=window.devicePixelRatio;
            avalH = (screen.availHeight / ratio)-60;
      }else{
        avalH=$(window).height();
         if(!isiOS7){
             avalH=avalH+deviceAddressBar;
         }else{
             avalH=avalH;
         }

      }


      var $cntimgz=$("#zoom-sp");
      var $ftr=$("footer");
      var $lt=$("#layout");
      $('body').append('<div id="sp_fdr"></div>');

      $('#sp_fdr').css({height:avalH});
      hideURLbar();

      $ftr.hide();
      $cntimgz.css({height:avalH}).show();

      $('html,body').scrollTop(1);
      $lt.css("cssText", "height: "+avalH+"px !important;overflow:hidden;");
      TweenLite.set('#layout', {y:20,transformOrigin: "50% 0%",ease: "Exposte.easeInOut"});

      var tl = new TimelineLite();

      //tl.to('#layout', 0.6, {rotationX:70,ease:"Exposte.easeInOut"},0, "rot1")
      tl.to('#layout', 0.9, {scale:0.90},"-=0.45", "sca2")
      tl.to('#layout', 0.6, {scale:0.65},"-=0.25", "sca2")
        //tl.to('#layout', 0.6, {rotationX:0}, "-=0.15", "rot2")
      tl.to('#zoom-sp', 0.4, {x:0,y: 0, onComplete:function(){
          $('#close-zoom-sp').removeClass().addClass('on');
          $('#open-zmt-sp').removeClass().addClass('on');
          $('#pinch-zoom-sp').removeClass().addClass('on');
          $lt.css("cssText", "height: "+avalH+"px !important;overflow:hidden;").hide();
      }},"-=0.5");

        $('#totpag-sp').html($this.elsGallery);

        $("#pgr-prev-sp").bind("click", function (ev) {
            ev.preventDefault();
            ev.stopImmediatePropagation();
            ev.stopPropagation();
            view_show.slideEl('prev');
            $(window).scrollTop(1);
        });
        $("#pgr-next-sp").bind("click", function (ev) {
            ev.preventDefault();
            ev.stopImmediatePropagation();
            ev.stopPropagation();
            view_show.slideEl('next');
            $(window).scrollTop(1);
        });

        $this.isDetailOpen=1;

    },
    closedetail: function () {
      var $this=this;
      var wh=window.screen.availHeight;
      var avalH=(wh-40);

      TweenLite.set('#layout', {y:0,transformOrigin: "50% 0%",ease: "Linear.easeNone"});

      var tl = new TimelineLite();

      tl.to('#zoom-sp', 0.6, {x: 0, y: avalH, onComplete: function () {
                $('#close-zoom-sp').removeClass();
                $('#open-zmt-sp').removeClass();
                $('#pinch-zoom-sp').removeClass();
                $('#zoom-sp').hide();
            }})
      tl.to('#layout', 0.4, {scale:1}, "-=0.15")
      tl.to('#layout', 0.4, {rotationX:0})
      tl.to('#layout', 0.4, {y:0,onComplete:function(){
          $("#layout").css("cssText", "height: auto !important;overflow:visible;");
      }}, "-=0.35");

      //delete medium
      $('#wrp-zoom-sp').html('').remove();

      //reset counter
      $this.isDetailOpen=0;
      $this.currSlide=0;
      $this.currSlideRight=0;
      $this.currSlideLeft=0;
      view_show.currSlide=0;
      view_show.currSlideRight=0;
      view_show.currSlideLeft=0;

   },
    setfullimg: function () {
        var $this=this;
        var $zoomcontainer=$('#wrp-full-sp');
        var domain=currdomain;
        var srcZoom=domain+''+$this.jsonitems[$this.currSlide].picture_zoom.path;
        $zoomcontainer.append('<span id="ico-loading-full" class="ui-icon ui-icon-loading spin"></span><img src="'+srcZoom+'" id="imgfull-sp">');

        $('#wrp-zoom-sp').hide();
        $zoomcontainer.show();
        $this.isFullVisible=1;

        $("#imgfull-sp").smoothZoom({
            width: '100%',
            height: '100%',
            initial_ZOOM: 100,
            zoom_MIN: 90,
            zoom_MAX: 200,
            initial_POSITION : '780 350',
            reset_ALIGN_TO: 'top top',
            responsive: true,
            zoom_BUTTONS_SHOW: false,
            pan_BUTTONS_SHOW: false,
            touch_DRAG: true,
            background_COLOR: 'transparent',
            border_SIZE: 0
        });

    },
    removefullimg : function(){
        $('#wrp-full-sp').html('');
    },
    currSlide : 0,
    currSlideLeft : -1,
    currSlideRight : 1,
    elsGallery : 0,
    firstLoad : 0,
    slide_pics : function(){
        var $this = this;
        $('#zoom-sp').append('<div id="wrp-zoom-sp" class="pageview-group"></div>');
        //$this.currSlide = el_index;
        $this.currSlideLeft = $this.currSlide - 1;
        $this.currSlideRight = $this.currSlide + 1;
        var domain=currdomain;
        var wrap_show = document.querySelector(".pageview-group");

        var imgLeft='',imgLeftType='';
        var imgRight='',imgRightType='';
        var imgCenter=$this.jsonitems[$this.currSlide].picture_medium;
        var imgCenterType=$this.checkImgType(imgCenter.width,imgCenter.height);

        if( $this.currSlideLeft == -1){
            imgLeft="#";
        }else{
            imgLeft=$this.jsonitems[$this.currSlideLeft].picture_medium;
            imgLeftType=$this.checkImgType(imgLeft.width,imgLeft.height);
        }
        if ( $this.currSlideRight == ($this.elsGallery)) {
            imgRight = "#";
        } else {
            imgRight = $this.jsonitems[$this.currSlideRight].picture_medium;
            imgRightType=$this.checkImgType(imgRight.width,imgRight.height);

        }


        wrap_show.addEventListener("bookPageChanged", function (e) {
            // k9_show.setshare_show();
            $('#currpag-sp').text($this.currSlide+1);
            $(e.pages.left).removeClass().addClass(imgLeftType).html('<span class="ui-icon ui-icon-loading spin"></span><img id="sx" src="' + domain+''+imgLeft.path + '">');
            $(e.pages.view).removeClass().addClass(imgCenterType).html('<span class="ui-icon ui-icon-loading spin"></span><img id="cx" src="' + domain+''+imgCenter.path + '">');
            $(e.pages.right).removeClass().addClass(imgRightType).html('<span class="ui-icon ui-icon-loading spin"></span><img id="dx" src="' + domain+''+imgRight.path + '">');
            $this.mngNextPrevIcons();
        }, false);

        wrap_show.addEventListener("bookPageMovedRight", function (e) {
            $this.currSlide--;
            $this.currSlideLeft = $this.currSlide - 1;
            $this.currSlideRight = $this.currSlide + 1;
            var imgSrc='';
            ($this.currSlideLeft<0) ? imgSrc='' : imgSrc=$this.jsonitems[$this.currSlideLeft].picture_medium;
            (imgSrc=='') ? imgType='' :  imgType=$this.checkImgType(imgSrc.width,imgSrc.height);

            $('#wrp-medium div').eq(0).removeClass().addClass(imgType).find('img').attr({src: domain+''+imgSrc.path});
            $('#currpag-sp').text($this.currSlide+1);

            view_show.currSlide = $this.currSlide;
            view_show.currSlideRight = $this.currSlideRight;
            //k9_show.setshare_show();
            $this.mngNextPrevIcons();
        }, false);

        wrap_show.addEventListener("bookPageMovedLeft", function (e) {
            $this.currSlide++;
            $this.currSlideLeft = $this.currSlide - 1;
            $this.currSlideRight = $this.currSlide + 1;
            var imgSrc='';
            ($this.currSlideRight>=$this.elsGallery) ? imgSrc='' : imgSrc=$this.jsonitems[$this.currSlideRight].picture_medium;
            (imgSrc=='') ? imgType='' :  imgType=$this.checkImgType(imgSrc.width,imgSrc.height);

            $('#wrp-medium div').eq(2).removeClass().addClass(imgType).find('img').attr({src:domain+''+imgSrc.path});
            $('#currpag-sp').text($this.currSlide+1);
            view_show.currSlide = $this.currSlide;
            view_show.currSlideRight = $this.currSlideRight;
            $this.mngNextPrevIcons();
            //k9_show.setshare_show();
        }, false);

        view_show = new k9glr(wrap_show);
        view_show.elsGallery = $this.elsGallery;
        view_show.currSlideRight = 0;
        view_show.currSlide = $this.currSlide;
        $this.firstLoad=1;
    },
 mngNextPrevIcons : function(){
     var $this=this;
     var $prev=$('#pgr-prev-sp');
     var $next=$('#pgr-next-sp');
     if ($this.currSlide < 1) {
         $prev.addClass('off');
     } else {
         $prev.removeClass('off');
     }
     if($this.currSlideRight>=$this.elsGallery){
         $next.addClass('off');
     }else{
         $next.removeClass('off');
     }
 },
 checkImgType : function(w,h){
    var imgtype='';
    if(w>h){
        imgtype='horizontal';
    }else{
        imgtype='vertical';
    }
    return imgtype;
 }
}