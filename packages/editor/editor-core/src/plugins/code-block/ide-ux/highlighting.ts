import { Decoration, DecorationSet } from 'prosemirror-view';

var KEYWORD_RE = /^(a(bstract|lias|nd|rguments|rray|s(m|sert)?|uto)|b(ase|egin|ool(ean)?|reak|yte)|c(ase|atch|har|hecked|lass|lone|ompl|onst|ontinue)|de(bugger|cimal|clare|f(ault|er)?|init|l(egate|ete)?)|do|double|e(cho|ls?if|lse(if)?|nd|nsure|num|vent|x(cept|ec|p(licit|ort)|te(nds|nsion|rn)))|f(allthrough|alse|inal(ly)?|ixed|loat|or(each)?|riend|rom|unc(tion)?)|global|goto|guard|i(f|mp(lements|licit|ort)|n(it|clude(_once)?|line|out|stanceof|t(erface|ernal)?)?|s)|l(ambda|et|ock|ong)|m(odule|utable)|NaN|n(amespace|ative|ext|ew|il|ot|ull)|o(bject|perator|r|ut|verride)|p(ackage|arams|rivate|rotected|rotocol|ublic)|r(aise|e(adonly|do|f|gister|peat|quire(_once)?|scue|strict|try|turn))|s(byte|ealed|elf|hort|igned|izeof|tatic|tring|truct|ubscript|uper|ynchronized|witch)|t(emplate|hen|his|hrows?|ransient|rue|ry|ype(alias|def|id|name|of))|u(n(checked|def(ined)?|ion|less|signed|til)|se|sing)|v(ar|irtual|oid|olatile)|w(char_t|hen|here|hile|ith)|xor|yield)$/;

var COM = 'com';
var KEY = 'key';
var NAM = 'nam';
var NUM = 'num';
var PCT = 'pct';
var REX = 'rex';
var SPC = 'spc';
var STR = 'str';
var UNK = 'unk';

var TOKEN_RES: { 0: string; 1: RegExp }[] = [
  [NUM, /#([0-9a-f]{6}|[0-9a-f]{3})\b/],
  [COM, /(\/\/|#).*?(?=\n|$)/],
  [COM, /\/\*[\s\S]*?\*\//],
  [COM, /<!--[\s\S]*?-->/],
  [REX, /\/(\\\/|[^\n])*?\//],
  [STR, /(['"`])(\\\1|[\s\S])*?\1/],
  [NUM, /[+-]?([0-9]*\.?[0-9]+|[0-9]+\.?[0-9]*)([eE][+-]?[0-9]+)?/],
  [PCT, /[\\.,:;+\-*\/=<>()[\]{}|?!&@~]/],
  [SPC, /\s+/],
  [NAM, /[\w$]+/],
  [UNK, /./],
];

export default function tokenize(text: string, start: number) {
  var decorations = [] as any;

  var len = TOKEN_RES.length;
  var offset = 0;
  var prefer_div_over_re = false;

  while (text) {
    for (var i = 0; i < len; i += 1) {
      var m = TOKEN_RES[i][1].exec(text);
      if (!m || m.index !== 0) {
        continue;
      }

      var cls = TOKEN_RES[i][0];
      if (cls === REX && prefer_div_over_re) {
        continue;
      }

      var tok = m[0];

      if (cls === NAM && KEYWORD_RE.test(tok)) {
        cls = KEY;
      }
      if (cls === SPC) {
        if (tok.indexOf('\n') >= 0) {
          prefer_div_over_re = false;
        }
      } else {
        prefer_div_over_re = cls === NUM || cls === NAM;
      }

      text = text.slice(tok.length);
      decorations.push(
        Decoration.inline(start + offset, start + offset + tok.length, {
          class: cls,
        }),
      );
      offset += tok.length;
      break;
    }
  }
  return decorations;
}
