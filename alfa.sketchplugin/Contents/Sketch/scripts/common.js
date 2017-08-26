var MD = {
  init: function (context, command, args) {

    var commandOptions = '' + args;

    this.prefs = NSUserDefaults.standardUserDefaults();
    this.context = context;

    this.version = this.context.plugin.version() + "";
    this.MDVersion = this.prefs.stringForKey("MDVersion") + "" || 0;

    this.baseUrl = "http://alfabank-icons.surge.sh/";

    this.extend(context);
    this.pluginRoot = this.scriptPath
      .stringByDeletingLastPathComponent()
      .stringByDeletingLastPathComponent()
      .stringByDeletingLastPathComponent();
    this.pluginSketch = this.pluginRoot + "/Contents/Sketch/scripts";
    this.resources = this.pluginRoot + '/Contents/Resources';

    coscript.setShouldKeepAround(false);


    if (command && command == "init") {
      // this.menu();
      // this.checkUpdate();
      return false;
    }

    this.document = context.document;
    this.documentData = this.document.documentData();
    this.UIMetadata = context.document.mutableUIMetadata();
    this.window = this.document.window();
    this.pages = this.document.pages();
    this.page = this.document.currentPage();
    this.artboard = this.page.currentArtboard();
    this.current = this.artboard || this.page;

    this.configs = this.getConfigs();


    if (command) {
      switch (command) {
        case "importer":
          var panel = this.importerPanel();
          // this.Importer().import(args);
          break;
      }
    }
  },
  extend: function(options, target) {
    var target = target || this;

    for (var key in options) {
      target[key] = options[key];
    }
    return target;
  }
};



MD.extend({
    prefix: "MDConfig",
    getConfigs: function(container){
        var configsData;
        if(container){
            configsData = this.command.valueForKey_onLayer(this.prefix, container);
        }
        else{
            configsData = this.UIMetadata.objectForKey(this.prefix);
        }

        return JSON.parse(configsData);
    },
     setConfigs: function(newConfigs, container){
        var configsData;
        newConfigs.timestamp = new Date().getTime();
        if(container){
            configsData = this.extend(newConfigs, this.getConfigs(container) || {});
            this.command.setValue_forKey_onLayer(JSON.stringify(configsData), this.prefix, container);
        }
        else{
            configsData = this.extend(newConfigs, this.getConfigs() || {});
            this.UIMetadata.setObject_forKey (JSON.stringify(configsData), this.prefix);
        }
        var saveDoc = this.addShape();
        this.page.addLayers([saveDoc]);
        this.removeLayer(saveDoc);
        return configsData;
    },
    removeConfigs: function(container){
        if(container){
            this.command.setValue_forKey_onLayer(null, prefix, container);
        }
        else{
            configsData = this.UIMetadata.setObject_forKey (null, this.prefix);
        }

    }
});

// api.js
MD.extend({
  is: function (layer, theClass) {
    if (!layer) return false;
    var klass = layer.class();
    return klass === theClass;
  },
  addGroup: function () {
    return MSLayerGroup.new();
  },
  addShape: function () {
    var shape = MSRectangleShape.alloc().initWithFrame(NSMakeRect(0, 0, 100, 100));
    return MSShapeGroup.shapeWithPath(shape);
  },
  addText: function (container, string) {
    var text = MSTextLayer.new();
    text.setStringValue(string || 'Text');
    return text;
  },
  removeLayer: function (layer) {
    var container = layer.parentGroup();
    if (container) container.removeLayer(layer);
  },
  setRadius: function (layer, radius) {
    layer.layers().firstObject().setCornerRadiusFromComponents(radius);
  },
  getGroupRect: function (group) {
    var rect = group.groupBoundsForLayers();
    return {
      x: Math.round(rect.x()),
      y: Math.round(rect.y()),
      width: Math.round(rect.width()),
      height: Math.round(rect.height()),
      maxX: Math.round(rect.x() + rect.width()),
      maxY: Math.round(rect.y() + rect.height()),
      setX: function (x) { rect.setX(x); this.x = x; this.maxX = this.x + this.width; },
      setY: function (y) { rect.setY(y); this.y = y; this.maxY = this.y + this.height; },
      setWidth: function (width) { rect.setWidth(width); this.width = width; this.maxX = this.x + this.width; },
      setHeight: function (height) { rect.setHeight(height); this.height = height; this.maxY = this.y + this.height; }
    };
  },
  getRect: function (layer) {
    var rect = layer.frame();
    return {
      x: Math.round(rect.x()),
      y: Math.round(rect.y()),
      width: Math.round(rect.width()),
      height: Math.round(rect.height()),
      maxX: Math.round(rect.x() + rect.width()),
      maxY: Math.round(rect.y() + rect.height()),
      setX: function (x) { rect.setX(x); this.x = x; this.maxX = this.x + this.width; },
      setY: function (y) { rect.setY(y); this.y = y; this.maxY = this.y + this.height; },
      setWidth: function (width) { rect.setWidth(width); this.width = width; this.maxX = this.x + this.width; },
      setHeight: function (height) { rect.setHeight(height); this.height = height; this.maxY = this.y + this.height; },
      setConstrainProportions: function(val) { rect.setConstrainProportions(val); }
    };
  },
  getCenterOfViewPort: function () {

    var midX, midY;

    if(MD.artboard) {
      midX = MD.getRect(MD.artboard).width/2;
      midY = MD.getRect(MD.artboard).height/2;
    } else {
      var contentDrawView = MD.document.currentView();
      midX = Math.round((contentDrawView.frame().size.width/2 - contentDrawView.horizontalRuler().baseLine())/contentDrawView.zoomValue());
      midY = Math.round((contentDrawView.frame().size.height / 2 - contentDrawView.verticalRuler().baseLine()) / contentDrawView.zoomValue());
    }

    return {
      x: midX,
      y: midY
    }
  },
  toNopPath: function (str) {
    return this.toJSString(str).replace(/[\/\\\?]/g, " ");
  },
  toHTMLEncode: function (str) {
    return this.toJSString(str)
      .replace(/\</g, "&lt;")
      .replace(/\>/g, '&gt;')
      .replace(/\'/g, "&#39;")
      .replace(/\"/g, "&quot;")
      .replace(/\u2028/g, "\\u2028")
      .replace(/\u2029/g, "\\u2029")
      .replace(/\ud83c|\ud83d/g, "")
      ;
    // return str.replace(/\&/g, "&amp;").replace(/\"/g, "&quot;").replace(/\'/g, "&#39;").replace(/\</g, "&lt;").replace(/\>/g, '&gt;');
  },
  emojiToEntities: function (str) {
    var emojiRanges = [
      "\ud83c[\udf00-\udfff]", // U+1F300 to U+1F3FF
      "\ud83d[\udc00-\ude4f]", // U+1F400 to U+1F64F
      "\ud83d[\ude80-\udeff]"  // U+1F680 to U+1F6FF
    ];
    return str.replace(
      new RegExp(emojiRanges.join("|"), "g"),
      function (match) {
        var c = encodeURIComponent(match).split("%"),
          h = ((parseInt(c[1], 16) & 0x0F))
            + ((parseInt(c[2], 16) & 0x1F) << 12)
            + ((parseInt(c[3], 16) & 0x3F) << 6)
            + (parseInt(c[4], 16) & 0x3F);
        return "&#" + h.toString() + ";";
      });
  },
  toSlug: function (str) {
    return this.toJSString(str)
      .toLowerCase()
      .replace(/(<([^>]+)>)/ig, "")
      .replace(/[\/\+\|]/g, " ")
      .replace(new RegExp("[\\!@#$%^&\\*\\(\\)\\?=\\{\\}\\[\\]\\\\\\\,\\.\\:\\;\\']", "gi"), '')
      .replace(/\s+/g, '-')
      ;
  },
  toJSString: function (str) {
    return new String(str).toString();
  },
  toJSNumber: function (str) {
    return Number(this.toJSString(str));
  },
  pointToJSON: function (point) {
    return {
      x: parseFloat(point.x),
      y: parseFloat(point.y)
    };
  },
  rectToJSON: function (rect, referenceRect) {
    if (referenceRect) {
      return {
        x: Math.round(rect.x() - referenceRect.x()),
        y: Math.round(rect.y() - referenceRect.y()),
        width: Math.round(rect.width()),
        height: Math.round(rect.height())
      };
    }

    return {
      x: Math.round(rect.x()),
      y: Math.round(rect.y()),
      width: Math.round(rect.width()),
      height: Math.round(rect.height())
    };
  },
  colorToJSON: function (color) {
    return {
      r: Math.round(color.red() * 255),
      g: Math.round(color.green() * 255),
      b: Math.round(color.blue() * 255),
      a: color.alpha(),
      "color-hex": color.immutableModelObject().stringValueWithAlpha(false) + " " + Math.round(color.alpha() * 100) + "%",
      "argb-hex": "#" + this.toHex(color.alpha() * 255) + color.immutableModelObject().stringValueWithAlpha(false).replace("#", ""),
      "css-rgba": "rgba(" + [
        Math.round(color.red() * 255),
        Math.round(color.green() * 255),
        Math.round(color.blue() * 255),
        (Math.round(color.alpha() * 100) / 100)
      ].join(",") + ")",
      "ui-color": "(" + [
        "r:" + (Math.round(color.red() * 100) / 100).toFixed(2),
        "g:" + (Math.round(color.green() * 100) / 100).toFixed(2),
        "b:" + (Math.round(color.blue() * 100) / 100).toFixed(2),
        "a:" + (Math.round(color.alpha() * 100) / 100).toFixed(2)
      ].join(" ") + ")"
    };
  },
  colorStopToJSON: function (colorStop) {
    return {
      color: this.colorToJSON(colorStop.color()),
      position: colorStop.position()
    };
  },
  gradientToJSON: function (gradient) {
    var stopsData = [],
      stop, stopIter = gradient.stops().objectEnumerator();
    while (stop = stopIter.nextObject()) {
      stopsData.push(this.colorStopToJSON(stop));
    }

    return {
      type: GradientTypes[gradient.gradientType()],
      from: this.pointToJSON(gradient.from()),
      to: this.pointToJSON(gradient.to()),
      colorStops: stopsData
    };
  },
  shadowToJSON: function (shadow) {
    return {
      type: shadow instanceof MSStyleShadow ? "outer" : "inner",
      offsetX: shadow.offsetX(),
      offsetY: shadow.offsetY(),
      blurRadius: shadow.blurRadius(),
      spread: shadow.spread(),
      color: this.colorToJSON(shadow.color())
    };
  },
  getRadius: function (layer) {
    return (layer.layers && this.is(layer.layers().firstObject(), MSRectangleShape)) ? layer.layers().firstObject().fixedRadius() : 0;
  },
  getBorders: function (style) {
    var bordersData = [],
      border, borderIter = style.borders().objectEnumerator();
    while (border = borderIter.nextObject()) {
      if (border.isEnabled()) {
        var fillType = FillTypes[border.fillType()],
          borderData = {
            fillType: fillType,
            position: BorderPositions[border.position()],
            thickness: border.thickness()
          };

        switch (fillType) {
          case "color":
            borderData.color = this.colorToJSON(border.color());
            break;

          case "gradient":
            borderData.gradient = this.gradientToJSON(border.gradient());
            break;

          default:
            continue;
        }

        bordersData.push(borderData);
      }
    }

    return bordersData;
  },
  getFills: function (style) {
    var fillsData = [],
      fill, fillIter = style.fills().objectEnumerator();
    while (fill = fillIter.nextObject()) {
      if (fill.isEnabled()) {
        var fillType = FillTypes[fill.fillType()],
          fillData = {
            fillType: fillType
          };

        switch (fillType) {
          case "color":
            fillData.color = this.colorToJSON(fill.color());
            break;

          case "gradient":
            fillData.gradient = this.gradientToJSON(fill.gradient());
            break;

          default:
            continue;
        }

        fillsData.push(fillData);
      }
    }

    return fillsData;
  },
  getShadows: function (style) {
    var shadowsData = [],
      shadow, shadowIter = style.shadows().objectEnumerator();
    while (shadow = shadowIter.nextObject()) {
      if (shadow.isEnabled()) {
        shadowsData.push(this.shadowToJSON(shadow));
      }
    }

    shadowIter = style.innerShadows().objectEnumerator();
    while (shadow = shadowIter.nextObject()) {
      if (shadow.isEnabled()) {
        shadowsData.push(this.shadowToJSON(shaxdow));
      }
    }

    return shadowsData;
  },
  getOpacity: function (style) {
    return style.contextSettings().opacity()
  },
  getStyleName: function (layer) {
    var styles = (this.is(layer, MSTextLayer)) ? this.document.documentData().layerTextStyles() : this.document.documentData().layerStyles(),
      layerStyle = layer.style(),
      sharedObjectID = layerStyle.sharedObjectID(),
      style;

    styles = styles.objectsSortedByName();

    if (styles.count() > 0) {
      style = this.find({ key: "(objectID != NULL) && (objectID == %@)", match: sharedObjectID }, styles);
    }

    if (!style) return "";
    return this.toJSString(style.name());
  },
  updateContext: function () {
    this.context.document = NSDocumentController.sharedDocumentController().currentDocument();
    this.context.selection = this.context.document.selectedLayers();

    return this.context;
  },
  openURL: function(url){
    var nsurl = NSURL.URLWithString(url);
    NSWorkspace.sharedWorkspace().openURL(nsurl)
  }
});

// help.js
MD.extend({
    mathHalf: function(number){
        return Math.round( number / 2 );
    },
    convertUnit: function(length, isText, percentageType){
        if(percentageType && this.artboard){
            var artboardRect = this.getRect( this.artboard );
            if (percentageType == "width") {
                 return Math.round((length / artboardRect.width) * 1000) / 10 + "%";

            }
            else if(percentageType == "height"){
                return Math.round((length / artboardRect.height) * 1000) / 10 + "%";
            }
        }

        var length = Math.round( length / this.configs.scale * 10 ) / 10,
            units = this.configs.unit.split("/"),
            unit = units[0];

        if( units.length > 1 && isText){
            unit = units[1];
        }

        return length + unit;
    },
    toHex:function(c) {
        var hex = parseInt(c, 16);
        return hex.length == 1 ? "0" + hex :hex;
    },
    hexToNSColor: function (hex, alpha) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: this.toHex(result[1])/255,
            g: this.toHex(result[2])/255,
            b: this.toHex(result[3])/255,
            a: alpha || 1
        } : null;
    },
    hexToRgb:function(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: this.toHex(result[1]),
            g: this.toHex(result[2]),
            b: this.toHex(result[3])
        } : null;
    },
    isIntersect: function(targetRect, layerRect){
        return !(
            targetRect.maxX <= layerRect.x ||
            targetRect.x >= layerRect.maxX ||
            targetRect.y >= layerRect.maxY ||
            targetRect.maxY <= layerRect.y
        );
    },
    getDistance: function(targetRect, containerRect){
        var containerRect = containerRect || this.getRect(this.current);

        return {
            top: (targetRect.y - containerRect.y),
            right: (containerRect.maxX - targetRect.maxX),
            bottom: (containerRect.maxY - targetRect.maxY),
            left: (targetRect.x - containerRect.x),
        }
    },
    message: function(message){
        this.document.showMessage(message);
    },
    findInJsArray: function (val, array) {
        for (var i = 0; i < array.length; i++) {
            if (array[i] == val) {
                return true;
            }
        }
        return false;
    },
    findSymbolByName: function (symbolName) {
        var targetSymbols = this.documentData.allSymbols();
        for (var j = 0; j < targetSymbols.count(); j++) {
            var targetSymbol = targetSymbols.objectAtIndex(j);
            if (targetSymbol.name().isEqualToString(symbolName)) {
                return targetSymbol;
            }
        }
        return false;
    },
    findSymbol: function (targetSymbols, clonedSymbol) {
        for (var j = 0; j < targetSymbols.count(); j++) {
            var targetSymbol = targetSymbols.objectAtIndex(j);
            if (clonedSymbol.name().isEqualToString(targetSymbol.name())) {
                return true;
            }
        }
        return false;
    },
    find: function(format, container, returnArray){
        if(!format || !format.key  || !format.match){
            return false;
        }
        var predicate = NSPredicate.predicateWithFormat(format.key,format.match),
            container = container || this.current,
            items;

        if(container.pages){
            items = container.pages();
        }
        else if( this.is( container, MSSharedStyleContainer ) || this.is( container, MSSharedTextStyleContainer ) ){
            items = container.objectsSortedByName();
        }
        else if( container.children ){
            items = container.children();
        }
        else{
            items = container;
        }

        var queryResult = items.filteredArrayUsingPredicate(predicate);

        if(returnArray) return queryResult;

        if (queryResult.count() == 1){
            return queryResult[0];
        } else if (queryResult.count() > 0){
            return queryResult;
        } else {
            return false;
        }
    },
    clearAllMarks: function(){
        var layers = this.page.children().objectEnumerator();
        while(layer = layers.nextObject()) {
            if(this.is(layer, MSLayerGroup) && this.regexNames.exec(layer.name())){
                this.removeLayer(layer)
            }
        }
    },
    toggleHidden: function(){
        var isHidden = (this.configs.isHidden)? false : !Boolean(this.configs.isHidden);
        this.configs = this.setConfigs({isHidden: isHidden});

        var layers = this.page.children().objectEnumerator();

        while(layer = layers.nextObject()) {
            if(this.is(layer, MSLayerGroup) && this.regexNames.exec(layer.name())){
                layer.setIsVisible(!isHidden);
            }
        }
    },
    toggleLocked: function(){
        var isLocked = (this.configs.isLocked)? false : !Boolean(this.configs.isLocked);
        this.configs = this.setConfigs({isLocked: isLocked});

        var layers = this.page.children().objectEnumerator();

        while(layer = layers.nextObject()) {
            if(this.is(layer, MSLayerGroup) && this.regexNames.exec(layer.name())){
                layer.setIsLocked(isLocked);
            }
        }
    },
    isImmutableSketchObject: function(sketchObject) {
        return !!(
            sketchObject &&
            sketchObject.class().mutableClass &&
            sketchObject.class().mutableClass() &&
            sketchObject.class().mutableClass() !== sketchObject.class()
        );
    },
    mutableSketchObject: function(immutableSketchObject) {
        if (immutableSketchObject && immutableSketchObject.class) {
            const immutableClass = immutableSketchObject.class();
            if (immutableClass.mutableClass) {
            const mutableClass = immutableClass.mutableClass();
            return mutableClass.new().initWithImmutableModelObject(
                immutableSketchObject
            );
            }
        }
    },

    $forEach: function(collection, iterator) {
        for (var i = 0; i < collection.count(); i++) {
        const item = collection.objectAtIndex(i);
        const returnValue = iterator(item, i, collection);
        if (returnValue === false) {
            break;
        }
        }
    },

    $map: function(collection, transform) {
        const result = [];
        $.forEach(collection, function(item, i, collection) {
        result.push(transform(item, i, collection));
        });
        return result;
    },

    $mapObject: function(collection, transform) {
        const results = {};
        $.forEach(collection, function(item, i, collection) {
        const result = transform(item, i, collection);
        const key = result[0];
        const value = result[1];
        results[key] = value;
        });
        return results;
    },

    $find: function(collection, predicate) {
        var result;
        $.forEach(collection, function(item, i, collection) {
        if (predicate(item, i, collection)) {
            result = item;
            return false;
        }
        });
        return result;
    },

    dictionaryWithMutableSketchObjects: function(dictionary) {
    return $mapObject(dictionary.allKeys(), function(key) {
        const object = dictionary.objectForKey(key);
        if (object.class().dictionary) {
        return [key, dictionaryWithMutableSketchObjects(object)];
        } else if (isImmutableSketchObject(object)) {
        return [key, mutableSketchObject(object)];
        } else {
        return [key, object];
        }
    });
    },

    arrayWithMutableSketchObjects: function(array) {
        return $map(array, function(object) {
            if (isImmutableSketchObject(object)) {
            return mutableSketchObject(object);
            } else {
            return object;
        }});

        // for(var i = 0; i < array.length; i++) {
        //     var object = array[i];
        //     if (MD.isImmutableSketchObject(object)) {
        //         array[i] = MD.mutableSketchObject(object);
        //     }
        // }

        // return array;

    }

});

//shared.js
MD.extend({
  sharedLayerStyle: function(name, color, borderColor) {
    var sharedStyles = this.documentData.layerStyles(),
      style = this.find({
        key: "(name != NULL) && (name == %@)",
        match: name
      }, sharedStyles);

    style = (!style || this.is(style, MSSharedStyle)) ? style : style[0];

    if (style == false) {
      style = MSStyle.alloc().init();

      var color = MSColor.colorWithRed_green_blue_alpha(color.r, color.g, color.b, color.a),
        fill = style.addStylePartOfType(0);

      fill.color = color;

      if (borderColor) {
        var border = style.addStylePartOfType(1),
          borderColor = MSColor.colorWithRed_green_blue_alpha(borderColor.r, borderColor.g, borderColor.b, borderColor.a);

        border.color = borderColor;
        border.thickness = 1;
        border.position = 1;
      }

      sharedStyles.addSharedStyleWithName_firstInstance(name, style);
    }

    return (style.newInstance) ? style.newInstance() : style;
  },

  sharedTextStyle: function(name, color, alignment, fontFamily, fontSize, lineHeight, leading) {
    var sharedStyles = this.document.documentData().layerTextStyles(),
    style = this.find({
      key: "(name != NULL) && (name == %@)",
      match: name
    }, sharedStyles);

    style = (!style || this.is(style, MSSharedStyle)) ? style : style[0];

    if (style == false && color) {
      var color = MSColor.colorWithRed_green_blue_alpha(color.r, color.g, color.b, color.a),
        alignment = alignment || 0, //[left, right, center, justify]
        fontFamily = fontFamily || 'Roboto',
        lineHeight = lineHeight || 15,
        fontSize = fontSize || 13,
        leading = leading || 0,
        text = this.addText(this.page);

      text.setTextColor(color);
      text.setFontPostscriptName(fontFamily);
      text.setLeading(leading);
      text.lineHeight = lineHeight;
      text.setFontSize(fontSize);
      text.setTextAlignment(alignment);

      style = text.style();
      sharedStyles.addSharedStyleWithName_firstInstance(name, style);
      this.removeLayer(text);
    }

    return (style.newInstance) ? style.newInstance() : style;
  }
});

// colors.js
MD.extend({
    getSelectionColor: function(){
        var self = this,
            colors = [];
        for (var i = 0; i < this.selection.count(); i++) {
            var layer = this.selection[i];
            if ( !this.is(layer, MSSliceLayer) ) {
                var layerStyle = layer.style(),
                    fills = this.getFills(layerStyle),
                    borders = this.getBorders(layerStyle);

                for (var n = 0; n < fills.length; n++) {
                    var fill = fills[n];
                    if(fill.fillType != "gradient"){
                        colors.push({name: '', color: fill.color});
                    }
                    else{
                        for (var w = 0; w < fill.gradient.colorStops.length; w++) {
                            var gColor = fill.gradient.colorStops[w];
                            colors.push({name: '', color: gColor.color});
                        }
                    }
                }
                for (var n = 0; n < borders.length; n++) {
                    var border = borders[n];
                    if(border.fillType != "gradient"){
                        colors.push({name: '', color: border.color});
                    }
                    else{
                        for (var w = 0; w < border.gradient.colorStops.length; w++) {
                            var gColor = border.gradient.colorStops[w];
                            colors.push({name: '', color: gColor.color});
                        }
                    }
                }
            }

            if ( this.is(layer, MSTextLayer) ) {
                colors.push({name: '', color: this.colorToJSON(layer.textColor())});
            }
        };

        return colors;
    },
    colorNames: function(colors){
        var colorNames = {};

        colors.forEach(function(color){
            var colorID = color.color["argb-hex"];
            colorNames[colorID] = color.name;
        });
        return colorNames;
    },
    manageColors: function(){
        var self = this,
            data = (this.configs.colors)? this.configs.colors: [];

        return this.MDPanel({
            url: this.pluginSketch + "/panel/colors.html",
            width: 320,
            height: 451,
            data: data,
            floatWindow: true,
            identifier: "com.utom.measure.colors",
            callback: function( data ){
                var colors = data;
                self.configs = self.setConfigs({
                    colors: colors,
                    colorNames: self.colorNames(colors)
                });

            },
            addCallback: function(windowObject){
                self.updateContext();
                self.init(self.context);
                var data = self.getSelectionColor();
                if(data.length > 0){
                    windowObject.evaluateWebScript("addColors(" + JSON.stringify(data) + ");");
                }
            },
            importCallback: function(windowObject){
                var data = self.importColors();
                if(data.length > 0){
                    windowObject.evaluateWebScript("addColors(" + JSON.stringify(data) + ");");
                    return true;
                }
                else{
                    return false;
                }
            },
            exportCallback: function(windowObject){
                return self.exportColors();
            },
            exportXMLCallback: function(windowObject){
                return self.exportColorsXML();
            }
        });
    },
    importColors: function(){
        var openPanel = NSOpenPanel.openPanel();
        openPanel.setCanChooseDirectories(false);
        openPanel.setCanCreateDirectories(false);
        openPanel.setDirectoryURL(NSURL.fileURLWithPath("~/Documents/"));
        openPanel.setTitle(_("Choose a &quot;colors.json&quot;"));
        openPanel.setPrompt(_("Choose"));
        openPanel.setAllowedFileTypes(NSArray.arrayWithObjects("json"))

        if (openPanel.runModal() != NSOKButton) {
            return false;
        }
        var colors = JSON.parse(NSString.stringWithContentsOfFile_encoding_error(openPanel.URL().path(), 4, nil)),
            colorsData = [];

        colors.forEach(function(color){
            if( color.color && color.color.a && color.color.r && color.color.g && color.color.b && color.color["argb-hex"] && color.color["color-hex"] && color.color["css-rgba"] && color.color["ui-color"] ){
                colorsData.push(color);
            }
        });

        if(colorsData.length <= 0){
            return false;
        }
        return colorsData;

    },
    exportColors: function(){
        var filePath = this.document.fileURL()? this.document.fileURL().path().stringByDeletingLastPathComponent(): "~";
        var fileName = this.document.displayName().stringByDeletingPathExtension();
        var savePanel = NSSavePanel.savePanel();

        savePanel.setTitle(_("Export colors"));
        savePanel.setNameFieldLabel(_("Export to:"));
        savePanel.setPrompt(_("Export"));
        savePanel.setCanCreateDirectories(true);
        savePanel.setShowsTagField(false);
        savePanel.setAllowedFileTypes(NSArray.arrayWithObject("json"));
        savePanel.setAllowsOtherFileTypes(false);
        savePanel.setNameFieldStringValue(fileName + "-colors.json");

        if (savePanel.runModal() != NSOKButton) {
            return false;
        }
        var savePath = savePanel.URL().path().stringByDeletingLastPathComponent(),
            fileName = savePanel.URL().path().lastPathComponent();

        this.writeFile({
            content: JSON.stringify(this.configs.colors),
            path: savePath,
            fileName: fileName
        });

        return true;
    },
    exportColorsXML: function(){
        var filePath = this.document.fileURL()? this.document.fileURL().path().stringByDeletingLastPathComponent(): "~";
        var fileName = this.document.displayName().stringByDeletingPathExtension();
        var savePanel = NSSavePanel.savePanel();

        savePanel.setTitle(_("Export colors"));
        savePanel.setNameFieldLabel(_("Export to:"));
        savePanel.setPrompt(_("Export"));
        savePanel.setCanCreateDirectories(true);
        savePanel.setShowsTagField(false);
        savePanel.setAllowedFileTypes(NSArray.arrayWithObject("xml"));
        savePanel.setAllowsOtherFileTypes(false);
        savePanel.setNameFieldStringValue(fileName + "-colors.xml");

        if (savePanel.runModal() != NSOKButton) {
            return false;
        }
        var savePath = savePanel.URL().path().stringByDeletingLastPathComponent(),
            fileName = savePanel.URL().path().lastPathComponent(),
            XMLContent = [];

        XMLContent.push("<?xml version=\"1.0\" encoding=\"utf-8\"?>");
        XMLContent.push("<resources>");
        this.configs.colors.forEach(function(color){
            if(color.name){
                XMLContent.push("\t<color name=\"" + color.name + "\">" + color.color["argb-hex"] + "</color>");
            }
        });
        XMLContent.push("</resources>");

        this.writeFile({
            content: XMLContent.join("\r\n"),
            path: savePath,
            fileName: fileName
        });

        return true;
    }
})

// Panel.js
MD.extend({
  createCocoaObject: function (methods, superclass) {
    var uniqueClassName = "MD.sketch_" + NSUUID.UUID().UUIDString();
    var classDesc = MOClassDescription.allocateDescriptionForClassWithName_superclass_(uniqueClassName, superclass || NSObject);
    classDesc.registerClass();
    for (var selectorString in methods) {
      var selector = NSSelectorFromString(selectorString);
      [classDesc addInstanceMethodWithSelector:selector function:(methods[selectorString])];
    }
    return NSClassFromString(uniqueClassName).new();
  },

  addFirstMouseAcceptor: function (webView, contentView) {
    var button = this.createCocoaObject({
      'mouseDown:': function (evt) {
        // Remove this view. Subsequent events such the mouseUp event that will
        // probably immediately follow mouseDown or any other mouse events will
        // be handled as if this view is not here because it will not be here!
        this.removeFromSuperview();

        // Now send the same mouseDown event again as if the user had just
        // clicked. With the button gone, this will be handled by the WebView.
        NSApplication.sharedApplication().sendEvent(evt);
      },
    }, NSButton);

    button.setIdentifier('firstMouseAcceptor');
    button.setTransparent(true);
    button.setTranslatesAutoresizingMaskIntoConstraints(false);

    contentView.addSubview(button);

    var views = {
      button: button,
      webView: webView
    };

    // Match width of WebView.
    contentView.addConstraints([NSLayoutConstraint
            constraintsWithVisualFormat:'H:[button(==webView)]'
            options:NSLayoutFormatDirectionLeadingToTrailing
            metrics:null
            views:views]);

    // Match height of WebView.
    contentView.addConstraints([NSLayoutConstraint
            constraintsWithVisualFormat:'V:[button(==webView)]'
            options:NSLayoutFormatDirectionLeadingToTrailing
            metrics:null
            views:views]);

    // Match top of WebView.
    contentView.addConstraints([[NSLayoutConstraint
            constraintWithItem:button attribute:NSLayoutAttributeTop
            relatedBy:NSLayoutRelationEqual toItem:webView
            attribute:NSLayoutAttributeTop multiplier:1 constant:0]]);
  },

  MDPanel: function (options) {
    var self = this,
      threadDictionary,
      options = this.extend(options, {
        url: this.pluginSketch + "/panel/chips.html",
        width: 240,
        height: 316,
        floatWindow: false,
        hiddenClose: false,
        data: {},
        callback: function (data) { return data; }
      }),
      result = false;

    if (!options.remote) {
      options.url = encodeURI("file://" + options.url);
    }

    var frame = NSMakeRect(0, 0, options.width, (options.height + 32)),
      titleBgColor = NSColor.colorWithRed_green_blue_alpha(255, 255, 255, 1),
      contentBgColor = NSColor.colorWithRed_green_blue_alpha(1, 1, 1, 1);

    if (options.identifier) {
      threadDictionary = NSThread.mainThread().threadDictionary();
      if(threadDictionary[options.identifier]) {
        COScript.currentCOScript().setShouldKeepAround_(true);
        return;
      }
    }

    var Panel = NSPanel.alloc().init();

    Panel.setTitleVisibility(NSWindowTitleHidden);
    Panel.setTitlebarAppearsTransparent(true);
    Panel.standardWindowButton(NSWindowCloseButton).setHidden(options.hiddenClose);
    Panel.standardWindowButton(NSWindowMiniaturizeButton).setHidden(true);
    Panel.standardWindowButton(NSWindowZoomButton).setHidden(true);
    Panel.setFrame_display(frame, true);
    Panel.setBackgroundColor(contentBgColor);
    Panel.setWorksWhenModal(true);

    if (options.floatWindow) {
      Panel.becomeKeyWindow();
      Panel.setLevel(NSFloatingWindowLevel);
      threadDictionary[options.identifier] = Panel;
      // Long-running script
      COScript.currentCOScript().setShouldKeepAround_(true);
    }

    var contentView = Panel.contentView(),
      webView = WebView.alloc().initWithFrame(NSMakeRect(0, 0, options.width, options.height));

    var windowObject = webView.windowScriptObject();

    contentView.setWantsLayer(true);
    contentView.layer().setFrame(contentView.frame());

    webView.setBackgroundColor(contentBgColor);
    webView.setMainFrameURL_(options.url);
    contentView.addSubview(webView);

    var delegate = new MochaJSDelegate({
      "webView:didFinishLoadForFrame:": (function (webView, webFrame) {
        var MDAction = [
          "function MDAction(hash, data) {",
            "if(data){ window.MDData = encodeURI(JSON.stringify(data)); }",
            "window.location.hash = hash;",
          "}"
        ].join(""),
          DOMReady = [
            "$(", "function(){", "init(" + JSON.stringify(options.data) + ")", "}",");"
          ].join("");

        if (!options.remote) {
          windowObject.evaluateWebScript(MDAction);
          windowObject.evaluateWebScript(DOMReady);
        }

      }),
      "webView:didChangeLocationWithinPageForFrame:": (function (webView, webFrame) {
        var request = NSURL.URLWithString(webView.mainFrameURL()).fragment();

        if (request == "submit") {
          var data = JSON.parse(decodeURI(windowObject.valueForKey("MDData")));
          options.callback(data);
          result = true;
          if (!options.floatWindow) {
            windowObject.evaluateWebScript("window.location.hash = 'close';");
          }
        }

        if (request == 'drag-end') {
          var data = JSON.parse(decodeURI(windowObject.valueForKey("draggedIcon")));
          MD.Importer().convertSvgToSymbol(data);
          result = true;
        }

        if (request == 'changeLink') {
          var data = JSON.parse(decodeURI(windowObject.valueForKey("currentLink")));
          MD.openURL(data);
        }

        if(request == 'applyStyles') {
          var data = JSON.parse(decodeURI(windowObject.valueForKey("appliedStyles")));
          MD.Typography().applyTypographyStyles(data);
        }

        if (request == 'onWindowDidBlur') {
          MD.addFirstMouseAcceptor(webView, contentView);
        }

        if (request == "close") {
          if (!options.floatWindow) {
            Panel.orderOut(nil);
            NSApp.stopModal();
          }
          else {
            Panel.close();
          }
        }

        if (request == "focus") {
          var point = Panel.currentEvent().locationInWindow(),
            y = NSHeight(Panel.frame()) - point.y - 32;
          windowObject.evaluateWebScript("lookupItemInput(" + point.x + ", " + y + ")");
        }
        windowObject.evaluateWebScript("window.location.hash = '';");
      })
    });

    webView.setFrameLoadDelegate_(delegate.getClassInstance());
    // NSButton already returns YES for -acceptsFirstMouse: so all we need to do
    // is handle the mouseDown event.
    if (options.floatWindow) {
      Panel.center();
      Panel.makeKeyAndOrderFront(nil);
    }

    var closeButton = Panel.standardWindowButton(NSWindowCloseButton);
    closeButton.setCOSJSTargetFunction(function (sender) {
      var request = NSURL.URLWithString(webView.mainFrameURL()).fragment();

      if (options.floatWindow && request == "submit") {
        data = JSON.parse(decodeURI(windowObject.valueForKey("MDData")));
        options.callback(data);
      }

      if (options.identifier) {
        threadDictionary.removeObjectForKey(options.identifier);
      }

      self.wantsStop = true;
      if (options.floatWindow) {
        Panel.close();
      }
      else {
        Panel.orderOut(nil);
        NSApp.stopModal();
      }

    });
    closeButton.setAction("callAction:");

    var titlebarView = contentView.superview().titlebarViewController().view(),
      titlebarContainerView = titlebarView.superview();
    closeButton.setFrameOrigin(NSMakePoint(8, 8));
    titlebarContainerView.setFrame(NSMakeRect(0, options.height, options.width, 32));
    titlebarView.setFrameSize(NSMakeSize(options.width, 32));
    titlebarView.setTransparent(true);
    titlebarView.setBackgroundColor(titleBgColor);
    titlebarContainerView.superview().setBackgroundColor(titleBgColor);

    if (!options.floatWindow) {
      NSApp.runModalForWindow(Panel);
    }

    return result;
  },

  importerPanel: function () {
    var self = this,
      data = {};

    return this.MDPanel({
      // url: this.pluginSketch + "/panel/importer/index.html",
      url: MD.baseUrl + "demo",
      remote: true,
      width: 320,
      height: 500,
      data: data,
      identifier: 'com.sketch.material.icons',
      floatWindow: true,
      callback: function (data) {
        // self.configs = self.setConfigs({
        // table: data
        // });
      }
    });
  }

});

MD.extend({

  /**
   *
   *
   * @param {any} component
   */
  import: function (component, args, values) {
    if (component) {
      switch (component) {
        case "export":
          this.export();
          break;
      }
    }
  },

  /**
   * Return an object with removing the existing text and layer styles from a list.
   * This will avoid re-importing the style again from the source file.
   *
   * @param {object} styles
   */
  removeExistingStyleNamesFromList: function (styles) {
    var layerStyles = this.documentData.layerStyles(),
      textStyles = this.documentData.layerTextStyles(),
      result = {
        layerStyles: [],
        textStyles: []
      };

    if (styles.layerStyles) {
      for (var i = 0; i < styles.layerStyles.length; i++) {
        var style = this.find({
          key: "(name != NULL) && (name == %@)",
          match: styles.layerStyles[i]
        }, layerStyles);
        if (!style) {
          result.layerStyles.push(styles.layerStyles[i]);
        }
      }
    }

    if (styles.textStyles) {
      for (var i = 0; i < styles.textStyles.length; i++) {
        var style = this.find({
          key: "(name != NULL) && (name == %@)",
          match: styles.textStyles[i]
        }, textStyles);
        if (!style) {
          result.textStyles.push(styles.textStyles[i]);
        }
      }
    }

    return result;
  },

  /**
   * Imports the different sketch resources to the document
   *
   * @param {NSURL} url
   */
  importResources: function (url, values) {

    var symbolsToBeImported = [];
    for (var i = 0; i < values.length; i++) {
      if (!this.findSymbolByName(values[i])) {
        symbolsToBeImported.push(values[i]);
      }
    }

    if (symbolsToBeImported.length <= 0) {
      return;
    }

    var sourceDoc = MSDocument.new();
    var newDoc = sourceDoc.readFromURL_ofType_error(url, "com.bohemiancoding.sketch.drawing", nil);
    var symbolsPage = this.document.documentData().symbolsPageOrCreateIfNecessary();

    if (newDoc) {
      var sourceSymbols = sourceDoc.documentData().allSymbols();
      var addCount = 0;

      var loopSymbolMasters = sourceDoc.documentData().allSymbols().objectEnumerator();
      var symbolMaster;
      while (symbolMaster = loopSymbolMasters.nextObject()) {
          if (this.findInJsArray(symbolMaster.name(), symbolsToBeImported)) {
              MD.importSingleSymbol(symbolMaster, symbolsPage);
          }
      }
    }
  },


archiveDataFromSketchObject: function(object, options) {
  if (options && options.includeDependencies) {
    if (!options.document) {
      throw 'Options must include "document" when "includeDependencies" is true';
    }
    const documentData = options.document.documentData();
    const reader = MSPasteboardLayersReaderWriter.new();
    const symbols = reader.usedSymbolsInContainer_document(
      MSLayerArray.arrayWithLayer(object),
      documentData
    );
    object = NSDictionary.dictionaryWithDictionary({
      layers: [object.immutableModelObject()],
      symbols: symbols
    });
  }

  const immutableObject = object.immutableModelObject();
  return MSJSONDataArchiver.new().archivedDataWithRootObject_error(immutableObject, null);
},

sketchObjectFromArchiveData: function(archiveData) {
  if (archiveData.bytes) {
    /*
    var unarchiver = MSJSONDataUnarchiver.alloc().initForReadingWithData(archiveData);
    var object = unarchiver.decodeRoot();
    */
    var jsonString = NSString.alloc().initWithData_encoding(archiveData, NSUTF8StringEncoding);
    var object = MSJSONDataUnarchiver.unarchiveObjectWithString_asVersion_corruptionDetected_error(
      jsonString,
      999,
      null,
      null
    );

    if (object) {
      if (object.className() == 'MSArchiveHeader') {
        return object.root();
      } else {
        return object;
      }
    } else {
      return MSKeyedUnarchiver.unarchiveObjectWithData(archiveData);
    }

  } else {
    // Object has already been unarchived.
    return archiveData;
  }
},



  importSingleSymbol: function (symbol, symbolsPage) {

      var clonedSymbol = symbol.copy();
      var rect = clonedSymbol.rect();

      var targetSymbols = this.document.documentData().allSymbols();

      if (this.findSymbol(targetSymbols, symbol)) {
        return;
      }

      var symbolChildren = symbol.children();

      var loopChildren = symbolChildren.objectEnumerator();
      var child;

      while (child = loopChildren.nextObject()) {
        if (child.class() == "MSSymbolInstance") {
          MD.importSingleSymbol(child.symbolMaster(), symbolsPage);
        }
        MD.fixStyles(child);
      }

      targetSymbols = this.document.documentData().allSymbols();

      if (targetSymbols.length > 0) {
        var lastTargetSymbol = targetSymbols[targetSymbols.count() - 1];
        var lastTargetSymbolRect = lastTargetSymbol.rect();
        rect.origin.x = 0;
        rect.origin.y = lastTargetSymbolRect.origin.y + lastTargetSymbolRect.size.height + 25;
        symbol.rect = rect;
      } else {
        rect.origin.x = 0;
        rect.origin.y = rect.origin.y + rect.size.height + 25;
        symbol.rect = rect;
      }


    symbolsPage.addLayers([symbol]);

  },

  fixStyles: function(layer) {
    if(layer.class() == 'MSTextLayer') {

      var sharedStyle = layer.sharedObject();

      log("shared style....");

      if(sharedStyle) {
        var sharedStyleName = sharedStyle.name();
        layer.setStyle(MD.sharedTextStyle(sharedStyleName));
      }
    }
  },

  /**
   * Imports the shared styles to the document
   *
   * @param {NSURL} url
   * @param {object} styles a javascript obj containing layerStyles and textStyles
   */
  importSharedStyles: function (url, styles, all) {

    styles = this.removeExistingStyleNamesFromList(styles);

    if ((styles.layerStyles.length < 1 && styles.textStyles.length < 1) && !all) {
      return;
    }

    var sourceDoc = MSDocument.new(),
      newDoc = sourceDoc.readFromURL_ofType_error(url, "com.bohemiancoding.sketch.drawing", nil),
      name = '';

    if (newDoc) {
      var layerStyles = sourceDoc.documentData().layerStyles(),
        textStyles = sourceDoc.documentData().layerTextStyles();

      var docLayerStyles = this.documentData.layerStyles(),
        docTextStyles = this.documentData.layerTextStyles();

      if(all) {
        var layerStyleCount = layerStyles.numberOfSharedStyles();

        for(var i = 0; i < layerStyleCount; i++) {
          var style = layerStyles.sharedStyleAtIndex(i);
          var findLayerStyle = this.find({
            key: "(name != NULL) && (name == %@)",
            match: style.name()
          }, docLayerStyles);

          if(findLayerStyle == 0) {
            docLayerStyles.addSharedStyleWithName_firstInstance(style.name(), style.style());
          }
        }

        var textStyleStyleCount = textStyles.numberOfSharedStyles();
        for(var i = 0; i < textStyleStyleCount; i++) {
          var style = textStyles.sharedStyleAtIndex(i);

          var findTextStyle = this.find({
            key: "(name != NULL) && (name == %@)",
            match: style.name()
          }, docTextStyles);

          // log(style.name() + " — " + style.objectID());

          if(findTextStyle == 0) {
            docTextStyles.addSharedStyleWithName_firstInstance(style.name(), style.style());
          }
        }
        return;
      }

      // Check if there are any layer styles to be copied
      if (styles.layerStyles) {
        for (var i = 0; i < styles.layerStyles.length; i++) {
          var style = this.find({
            key: "(name != NULL) && (name == %@)",
            match: styles.layerStyles[i]
          }, layerStyles);
          this.documentData.layerStyles().addSharedStyleWithName_firstInstance(styles.layerStyles[i], style.style());
        }
      }

      // Check if there are any text styles to be copied
      if (styles.textStyles) {
        for (var i = 0; i < styles.textStyles.length; i++) {
          var style = this.find({
            key: "(name != NULL) && (name == %@)",
            match: styles.textStyles[i]
          }, textStyles);
          this.documentData.layerTextStyles().addSharedStyleWithName_firstInstance(styles.textStyles[i], style.style());
        }
      }

    }
  }

});

MD['Importer'] = function () {

  var _convertSvgToSymbol = function (data) {

    var name = data.name;

    var selectedLayers = MD.document.selectedLayers();
    var symbolsPage = MD.document.documentData().symbolsPageOrCreateIfNecessary();
    var existingSymbol = MD.findSymbolByName(name);

    if (existingSymbol) {
      var newSymbol = existingSymbol.newSymbolInstance(),
        newSymbolRect = MD.getRect(newSymbol),
        droppedElement = selectedLayers.firstLayer(),
        droppedEleRect = MD.getRect(droppedElement);

      MD.current.addLayers([newSymbol]);

      newSymbolRect.setX(droppedEleRect.x);
      newSymbolRect.setY(droppedEleRect.y);

      MD.current.removeLayer(droppedElement);
      return;
    }
    //avatars_and_widgets
    //alphabet_logos
    //internal_logos
    //non_material_product_logos
    //product_logos

    if (data.colorValue != '#000000' && data.isGlif ) {
      var colorHex = MD.hexToNSColor('#000000', 1)
      var color = MSColor.colorWithRed_green_blue_alpha(colorHex.r, colorHex.g, colorHex.b, 1);

      var replaceColorHex = MD.hexToNSColor(data.colorValue, 1);
      var replaceColor = MSColor.colorWithRed_green_blue_alpha(replaceColorHex.r, replaceColorHex.g, replaceColorHex.b, 1);

      var draggedLayer = selectedLayers.firstLayer();

      var layers = MD.find({ key: "(style.firstEnabledFill != NULL) && (style.firstEnabledFill.fillType == 0) && (style.firstEnabledFill.color == %@)", match: color }, draggedLayer);

      if (layers) {
        if (MD.is(layers, MSShapeGroup)) {
          var arr = NSArray.arrayWithObject(layers);
          layers = arr;
        }
        for (var i = 0; i < layers.count(); i++) {
          var layer = layers.objectAtIndex(i);
          var fill = layer.style().fills().firstObject();
          fill.color = replaceColor;
        }
      }
    }

    MSSymbolCreator.createSymbolFromLayers_withName_onSymbolsPage(selectedLayers, name, true);
  }


  return {
    import: _import,
    convertSvgToSymbol: _convertSvgToSymbol
  }
}
