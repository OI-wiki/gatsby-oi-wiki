const util = require("mdast-util-toc");
const yaml = require("js-yaml");

// convert "in-string" to "inString"
const strToCamel = str => {
  return str.replace(/-(.)/g, (match, chr) => chr.toUpperCase());
};

// convert "{'in-key': val}" to "{'inKey': val}"
const keysToCamel = obj => {
  if (obj) {
    const newObj = {};
    Object.keys(obj).forEach(k => {
      newObj[strToCamel(k)] = obj[k];
    });
    return newObj;
  }
  return obj;
};

const transformer = (markdownAST, pluginOptions) => {
  let prefs = {
    tight: false,
    fromHeading: 2,
    toHeading: 6,
    ...keysToCamel(pluginOptions)
  };

  // find position of TOC
  // [TOC]
  const index = markdownAST.children.findIndex(
    node => node.type === "paragraph" && node.children[0].type === "linkReference" && node.children[0].label === "TOC"
  );

  // we have no TOC
  if (prefs.every == false && index === -1) {
    return;
  }

  // this ist the ast we nned consider
  let tocMarkdownAST = {
    ...markdownAST,
    children: []
  };

  let depth;

  // add all headings
  markdownAST.children.forEach(node => {
    if (node.type === "heading" && node.depth > prefs.fromHeading - 1) {
      tocMarkdownAST.children.push(node);
    }
  });
  
  // calculate TOC
  const result = util(tocMarkdownAST, {
    maxDepth: prefs.toHeading,
    tight: prefs.tight,
    skip: Array.isArray(prefs.exclude) ? prefs.exclude.join("|") : prefs.exclude
  });

  const L={
    type: "jsx",
    value: '<div class="toc">'
  };
  const R={
    type: "jsx",
    value: "</div>"
  };

  if(prefs.every){
    if(result.map==null){
      return;
    }else {
      // insert the TOC≤
      markdownAST.children = [].concat(
        L, result.map, R,
        markdownAST.children
      );
    }
  }else {
    if(result.map==null){
      markdownAST.children = [].concat(
        markdownAST.children.slice(0, index),
        L,R,
        markdownAST.children.slice(index + 1)
      );
    }else {
      // insert the TOC≤
      markdownAST.children = [].concat(
        markdownAST.children.slice(0, index),
        L, result.map, R,
        markdownAST.children.slice(index + 1)
      );
    }
  }
};

module.exports = ({ markdownAST }, pluginOptions) => {
  return transformer(markdownAST, pluginOptions);
};
