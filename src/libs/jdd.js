import _ from 'lodash'

const jdd = {

  LEFT: 'left',
  RIGHT: 'right',

  EQUALITY: 'eq',
  TYPE: 'type',
  MISSING: 'missing',
  diffs: [],

  /**
   * Find the differences between the two objects and recurse into their sub objects.
   */
  findDiffs: function (/*Object*/ config1, /*Object*/ data1, /*Object*/ config2, /*Object*/ data2) {
    config1.currentPath.push('/');
    config2.currentPath.push('/');

    var key;
    var val;

    if (data1.length < data2.length) {
      /*
       * This means the second data has more properties than the first.
       * We need to find the extra ones and create diffs for them.
       */
      for (key in data2) {
        if (data2.hasOwnProperty(key)) {
          val = data1[key];
          if (!data1.hasOwnProperty(key)) {
            jdd.diffs.push(jdd.generateDiff(config1, jdd.generatePath(config1),
              config2, jdd.generatePath(config2, '/' + key),
              'The right side of this object has more items than the left side', jdd.MISSING));
          }
        }
      }
    }

    /*
     * Now we're going to look for all the properties in object one and
     * compare them to object two
     */
    for (key in data1) {
      if (data1.hasOwnProperty(key)) {
        val = data1[key];

        config1.currentPath.push(key);

        if (!data2.hasOwnProperty(key)) {
          /*
           * This means that the first data has a property which
           * isn't present in the second data
           */
          jdd.diffs.push(jdd.generateDiff(config1, jdd.generatePath(config1),
            config2, jdd.generatePath(config2),
            'Missing property <code>' + key + '</code> from the object on the right side', jdd.MISSING));
        } else {
          config2.currentPath.push(key);

          jdd.diffVal(data1[key], config1, data2[key], config2);
          config2.currentPath.pop();
        }
        config1.currentPath.pop();
      }
    }

    config1.currentPath.pop();
    config2.currentPath.pop();

    /*
     * Now we want to look at all the properties in object two that
     * weren't in object one and generate diffs for them.
     */
    for (key in data2) {
      if (data2.hasOwnProperty(key)) {
        val = data1[key];

        if (!data1.hasOwnProperty(key)) {
          jdd.diffs.push(jdd.generateDiff(config1, jdd.generatePath(config1),
            config2, jdd.generatePath(config2, key),
            'Missing property <code>' + key + '</code> from the object on the left side', jdd.MISSING));
        }
      }
    }
  },

  /**
   * Generate the differences between two values.  This handles differences of object
   * types and actual values.
   */
  diffVal: function (val1, config1, val2, config2) {

    if (_.isArray(val1)) {
      jdd.diffArray(val1, config1, val2, config2);
    } else if (_.isObject(val1)) {
      if (_.isArray(val2) || _.isString(val2) || _.isNumber(val2) || _.isBoolean(val2) || _.isNull(val2)) {
        jdd.diffs.push(jdd.generateDiff(config1, jdd.generatePath(config1),
          config2, jdd.generatePath(config2),
          'Both types should be objects', jdd.TYPE));
      } else {
        jdd.findDiffs(config1, val1, config2, val2);
      }
    } else if (_.isString(val1)) {
      if (!_.isString(val2)) {
        jdd.diffs.push(jdd.generateDiff(config1, jdd.generatePath(config1),
          config2, jdd.generatePath(config2),
          'Both types should be strings', jdd.TYPE));
      } else if (val1 !== val2) {
        jdd.diffs.push(jdd.generateDiff(config1, jdd.generatePath(config1),
          config2, jdd.generatePath(config2),
          'Both sides should be equal strings', jdd.EQUALITY));
      }
    } else if (_.isNumber(val1)) {
      if (!_.isNumber(val2)) {
        jdd.diffs.push(jdd.generateDiff(config1, jdd.generatePath(config1),
          config2, jdd.generatePath(config2),
          'Both types should be numbers', jdd.TYPE));
      } else if (val1 !== val2) {
        jdd.diffs.push(jdd.generateDiff(config1, jdd.generatePath(config1),
          config2, jdd.generatePath(config2),
          'Both sides should be equal numbers', jdd.EQUALITY));
      }
    } else if (_.isBoolean(val1)) {
      jdd.diffBool(val1, config1, val2, config2);
    } else if (_.isNull(val1) && !_.isNull(val2)) {
      jdd.diffs.push(jdd.generateDiff(config1, jdd.generatePath(config1),
        config2, jdd.generatePath(config2),
        'Both types should be nulls', jdd.TYPE));
    }
  },

  /**
   * Arrays are more complex because we need to recurse into them and handle different length
   * issues so we handle them specially in this function.
   */
  diffArray: function (val1, config1, val2, config2) {
    if (!_.isArray(val2)) {
      jdd.diffs.push(jdd.generateDiff(config1, jdd.generatePath(config1),
        config2, jdd.generatePath(config2),
        'Both types should be arrays', jdd.TYPE));
      return;
    }

    if (val1.length < val2.length) {
      /*
       * Then there were more elements on the right side and we need to
       * generate those differences.
       */
      for (var i = val1.length; i < val2.length; i++) {
        jdd.diffs.push(jdd.generateDiff(config1, jdd.generatePath(config1),
          config2, jdd.generatePath(config2, '[' + i + ']'),
          'Missing element <code>' + i + '</code> from the array on the left side', jdd.MISSING));
      }
    }
    _.each(val1, function (arrayVal, index) {
      if (val2.length <= index) {
        jdd.diffs.push(jdd.generateDiff(config1, jdd.generatePath(config1, '[' + index + ']'),
          config2, jdd.generatePath(config2),
          'Missing element <code>' + index + '</code> from the array on the right side', jdd.MISSING));
      } else {
        config1.currentPath.push('/[' + index + ']');
        config2.currentPath.push('/[' + index + ']');

        if (_.isArray(val2)) {
          /*
           * If both sides are arrays then we want to diff them.
           */
          jdd.diffVal(val1[index], config1, val2[index], config2);
        }
        config1.currentPath.pop();
        config2.currentPath.pop();
      }
    });
  },

  /**
   * We handle boolean values specially because we can show a nicer message for them.
   */
  diffBool: function (val1, config1, val2, config2) {
    if (!_.isBoolean(val2)) {
      jdd.diffs.push(jdd.generateDiff(config1, jdd.generatePath(config1),
        config2, jdd.generatePath(config2),
        'Both types should be booleans', jdd.TYPE));
    } else if (val1 !== val2) {
      if (val1) {
        jdd.diffs.push(jdd.generateDiff(config1, jdd.generatePath(config1),
          config2, jdd.generatePath(config2),
          'The left side is <code>true</code> and the right side is <code>false</code>', jdd.EQUALITY));
      } else {
        jdd.diffs.push(jdd.generateDiff(config1, jdd.generatePath(config1),
          config2, jdd.generatePath(config2),
          'The left side is <code>false</code> and the right side is <code>true</code>', jdd.EQUALITY));
      }
    }
  },

  /**
   * Format the object into the output stream and decorate the data tree with
   * the data about this object.
   */
  formatAndDecorate: function (/*Object*/ config, /*Object*/ data) {
    if (_.isArray(data)) {
      jdd.formatAndDecorateArray(config, data);
      return;
    }

    jdd.startObject(config);
    config.currentPath.push('/');

    var props = jdd.getSortedProperties(data);

    /*
     * If the first set has more than the second then we will catch it
     * when we compare values.  However, if the second has more then
     * we need to catch that here.
     */

    _.each(props, function (key) {
      config.out += jdd.newLine(config) + jdd.getTabs(config.indent) + '"' + jdd.unescapeString(key) + '": ';
      config.currentPath.push(key);
      config.paths.push({
        path: jdd.generatePath(config),
        line: config.line
      });
      jdd.formatVal(data[key], config);
      config.currentPath.pop();
    });

    jdd.finishObject(config);
    config.currentPath.pop();
  },

  /**
   * Format the array into the output stream and decorate the data tree with
   * the data about this object.
   */
  formatAndDecorateArray: function (/*Object*/ config, /*Array*/ data) {
    jdd.startArray(config);

    /*
     * If the first set has more than the second then we will catch it
     * when we compare values.  However, if the second has more then
     * we need to catch that here.
     */

    _.each(data, function (arrayVal, index) {
      config.out += jdd.newLine(config) + jdd.getTabs(config.indent);
      config.paths.push({
        path: jdd.generatePath(config, '[' + index + ']'),
        line: config.line
      });

      config.currentPath.push('/[' + index + ']');
      jdd.formatVal(arrayVal, config);
      config.currentPath.pop();
    });

    jdd.finishArray(config);
    config.currentPath.pop();
  },

  /**
   * Generate the start of the an array in the output stream and push in the new path
   */
  startArray: function (config) {
    config.indent++;
    config.out += '[';

    if (config.paths.length === 0) {
      /*
       * Then we are at the top of the array and we want to add
       * a path for it.
       */
      config.paths.push({
        path: jdd.generatePath(config),
        line: config.line
      });
    }

    if (config.indent === 0) {
      config.indent++;
    }
  },

  /**
   * Finish the array, outdent, and pop off all the path
   */
  finishArray: function (config) {
    if (config.indent === 0) {
      config.indent--;
    }

    jdd.removeTrailingComma(config);

    config.indent--;
    config.out += jdd.newLine(config) + jdd.getTabs(config.indent) + ']';
    if (config.indent !== 0) {
      config.out += ',';
    } else {
      config.out += jdd.newLine(config);
    }
  },

  /**
   * Generate the start of the an object in the output stream and push in the new path
   */
  startObject: function (config) {
    config.indent++;
    config.out += '{';

    if (config.paths.length === 0) {
      /*
       * Then we are at the top of the object and we want to add
       * a path for it.
       */
      config.paths.push({
        path: jdd.generatePath(config),
        line: config.line
      });
    }

    if (config.indent === 0) {
      config.indent++;
    }
  },

  /**
   * Finish the object, outdent, and pop off all the path
   */
  finishObject: function (config) {
    if (config.indent === 0) {
      config.indent--;
    }

    jdd.removeTrailingComma(config);

    config.indent--;
    config.out += jdd.newLine(config) + jdd.getTabs(config.indent) + '}';
    if (config.indent !== 0) {
      config.out += ',';
    } else {
      config.out += jdd.newLine(config);
    }
  },

  /**
   * Format a specific value into the output stream.
   */
  formatVal: function (val, config) {
    if (_.isArray(val)) {
      config.out += '[';

      config.indent++;
      _.each(val, function (arrayVal, index) {
        config.out += jdd.newLine(config) + jdd.getTabs(config.indent);
        config.paths.push({
          path: jdd.generatePath(config, '[' + index + ']'),
          line: config.line
        });

        config.currentPath.push('/[' + index + ']');
        jdd.formatVal(arrayVal, config);
        config.currentPath.pop();
      });
      jdd.removeTrailingComma(config);
      config.indent--;

      config.out += jdd.newLine(config) + jdd.getTabs(config.indent) + '],';
    } else if (_.isObject(val)) {
      jdd.formatAndDecorate(config, val);
    } else if (_.isString(val)) {
      config.out += '"' + jdd.unescapeString(val) + '",';
    } else if (_.isNumber(val)) {
      config.out += val + ',';
    } else if (_.isBoolean(val)) {
      config.out += val + ',';
    } else if (_.isNull(val)) {
      config.out += 'null,';
    }
  },

  /**
   * When we parse the JSON string we end up removing the escape strings when we parse it
   * into objects.  This results in invalid JSON if we insert those strings back into the
   * generated JSON.  We also need to look out for characters that change the line count
   * like new lines and carriage returns.
   *
   * This function puts those escaped values back when we generate the JSON output for the
   * well known escape strings in JSON.  It handles properties and values.
   *
   * This function does not handle unicode escapes.  Unicode escapes are optional in JSON
   * and the JSON output is still valid with a unicode character in it.
   */
  unescapeString: function (val) {
    if (val) {
      return val.replace('\\', '\\\\')    // Single slashes need to be replaced first
        .replace('\"', '\\"')     // Then double quotes
        .replace('\n', '\\n')     // New lines
        .replace('\b', '\\b')     // Backspace
        .replace('\f', '\\f')     // Formfeed
        .replace('\r', '\\r')     // Carriage return
        .replace('\t', '\\t');    // Horizontal tabs
    } else {
      return val;
    }
  },

  /**
   * Generate a JSON path based on the specific configuration and an optional property.
   */
  generatePath: function (config, prop) {
    var s = '';
    _.each(config.currentPath, function (path) {
      s += path;
    });

    if (prop) {
      s += '/' + prop;
    }

    if (s.length === 0) {
      return '/';
    } else {
      return s;
    }
  },

  /**
   * Add a new line to the output stream
   */
  newLine: function (config) {
    config.line++;
    return '\n';
  },

  /**
   * Sort all the relevant properties and return them in an alphabetical sort by property key
   */
  getSortedProperties: function (/*Object*/ obj) {
    var props = [];

    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        props.push(prop);
      }
    }

    props = props.sort(function (a, b) {
      return a.localeCompare(b);
    });

    return props;
  },

  /**
   * Generate the diff and verify that it matches a JSON path
   */
  generateDiff: function (config1, path1, config2, path2, /*String*/ msg, type) {
    if (path1 !== '/' && path1.charAt(path1.length - 1) === '/') {
      path1 = path1.substring(0, path1.length - 1);
    }

    if (path2 !== '/' && path2.charAt(path2.length - 1) === '/') {
      path2 = path2.substring(0, path2.length - 1);
    }

    var pathObj1 = _.find(config1.paths, function (path) {
      return path.path === path1;
    });

    var pathObj2 = _.find(config2.paths, function (path) {
      return path.path === path2;
    });

    if (!pathObj1) {
      throw 'Unable to find line number for (' + msg + '): ' + path1;
    }

    if (!pathObj2) {
      throw 'Unable to find line number for (' + msg + '): ' + path2;
    }

    return {
      path1: pathObj1,
      path2: pathObj2,
      type: type,
      msg: msg
    };
  },

  /**
   * Get the current indent level
   */
  getTabs: function (/*int*/ indent) {
    var s = '';
    for (var i = 0; i < indent; i++) {
      s += '    ';
    }

    return s;
  },

  /**
   * Remove the trailing comma from the output.
   */
  removeTrailingComma: function (config) {
    /*
     * Remove the trailing comma
     */
    if (config.out.charAt(config.out.length - 1) === ',') {
      config.out = config.out.substring(0, config.out.length - 1);
    }
  },

  /**
   * Create a config object for holding differences
   */
  createConfig: function () {
    return {
      out: '',
      indent: -1,
      currentPath: [],
      paths: [],
      line: 1
    };
  },

  // Format a valid json object into a prettified string
  formatJSON: function (json) {
    const config = jdd.createConfig()
    jdd.formatAndDecorate(config, json)

    return config.out.trim();
  },

};

export default jdd
