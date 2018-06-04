import {h, Component} from 'preact';

import * as tm from './timeline';

class Keyframe extends Component {
  render() {
    return (
      <span />
    );
  }
}

class ValueBody extends Component {
  render() {
    return (
      <div style={{
        background: `1px center url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><rect x="0" y="0" width="16" height="16" fill="rgba(128,128,128,0.5)" /><rect x="1" y="1" width="14" height="14" fill="#eee" /></svg>')`,
      }}>
      &nbsp;
      </div>
    );
  }
}

class ValueHeader extends Component {
  render() {
    return (
      <div style={{position: 'relative'}}>
        <span>TITLE</span>
      </div>
    );
  }
}

class BoxBody extends Component {
  render({rect, animated}) {
    const valued = [{}, {}];
    return (
      <div style={{minWidth: '100%'}}>
        <div style={{
          minWidth: '100%',
          background: '#eee',
        }}>&nbsp;</div>
        {valued.map(value => <ValueBody value={value} />)}
      </div>
    );
  }
}

class BoxHeader extends Component {
  render({rect, animated}) {
    const valued = [{}, {}];
    return (
      <div>
        <div style={{position: 'relative'}}>
          <span>{rect.name || 'root'}</span>
        </div>
        {valued.map(value => <ValueHeader value={value} />)}
      </div>
    );
  }
}

class KeyframeBody extends Component {
  constructor(...args) {
    super(...args);

    this.selectKey = this.selectKey.bind(this);
  }

  selectKey(event) {
    const height = event.target.clientHeight - 2;
    const x = event.offsetX / height | 0;

    this.props.setCursor(x);
  }

  render() {
    return (
      <div style={{}}>
        <div>&nbsp;</div>
        <div
          onClick={this.selectKey}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            // width: '100%',
            background: `1px center url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><rect x="0" y="0" width="16" height="16" fill="rgba(128,128,128,0.5)" /><rect x="1" y="1" width="14" height="14" fill="#eee" /></svg>')`,
          }}>
          &nbsp;
        </div>
      </div>
    );
  }
}

class KeyframeHeader extends Component {
  render({meta}) {
    return (
      <div>
        <div>&nbsp;</div>
        <div style={{position: 'fixed', top: 0, left: 0, right: '86.6%'}}>
          FIXED
        </div>
      </div>
    );
  }
}

class Duration extends Component {
  componentDidMount() {
    this.componentDidUpdate();
  }

  componentDidUpdate() {
    const cellHeight = this.base.parentNode.children[2].clientHeight - 2;
    this.base.style.width = `${cellHeight * this.props.duration * 30 + 2}px`;
  }

  render() {
    return (
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        background: `#666`,
        zIndex: -1,
      }} />
    );
  }
}

class Cursor extends Component {
  componentDidMount() {
    this.componentDidUpdate();
  }

  componentDidUpdate() {
    const cellHeight = this.base.parentNode.children[2].clientHeight - 2;
    this.base.style.width = `${cellHeight + 2}px`;
    this.base.style.left = `${cellHeight * this.props.cursor}px`;
    console.log('componentDidUpdate', cellHeight);
  }

  render() {
    return (
      <div style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        background: `#000`,
        zIndex: -1,
      }} />
    );
  }
}

const TIMELINE_NEUTRAL = 'TIMELINE_NEUTRAL';
const TIMELINE_SET_BEGIN = 'TIMELINE_SET_BEGIN';
const TIMELINE_SET_END = 'TIMELINE_SET_END';
const TIMELINE_ANIMATE = 'TIMELINE_ANIMATE';
const TIMELINE_ANIMATE_KEY = 'TIMELINE_ANIMATE_KEY'; 
const TIMELINE_MOVE_FRAME = 'TIMELINE_MOVE_FRAME';
const TIMELINE_CLIPBOARD = 'TIMELINE_CLIPBOARD';

class Timeline extends Component {
  constructor(...args) {
    super(...args);

    this.state = {
      state: TIMELINE_NEUTRAL,
      compareTo: null,
    };

    this.setCursor = this.setCursor.bind(this);
  }

  componentWillReceiveProps(props) {
    switch (this.props.meta.state) {
    case void 0:
    case TIMELINE_NEUTRAL:
      this.props.setEditorMeta('timeline', {
        beginRect: props.rect,
        endRect: props.rect,
        animation: {
          duration: props.meta.cursor / 30,
        },
      });
      break;
    case TIMELINE_ANIMATE:
      if (props.meta.state === 'TIMELINE_SET_BEGIN') {
        this.props.updateRect(this.props.meta.beginRect);
      }
      if (props.meta.state === 'TIMELINE_SET_END') {
        this.props.updateRect(this.props.meta.endRect);
      }
      break;
    case TIMELINE_ANIMATE_KEY:
      if (props.meta.state === 'TIMELINE_SET_BEGIN') {
        this.props.updateRect(this.props.meta.beginRect);
        break;
      }
      if (props.meta.state === 'TIMELINE_SET_END') {
        this.props.updateRect(this.props.meta.endRect);
        break;
      }

      // if past current duration, set new duration and lastRect

      // rects that changed
      // changed rects with names
      // create or update frames
      // updateAnimation({...})
      break;
    }
  }

  setCursor(x) {
    if (this.props.meta.state !== TIMELINE_ANIMATE_KEY) {
      this.props.setEditorMeta('timeline', {
        state: TIMELINE_ANIMATE_KEY,
        cursor: x,
      });
    }
    else if (this.props.meta.cursor !== x) {
      this.props.setEditorMeta('timeline', {
        cursor: x,
      });
    }
    else {
      this.props.setEditorMeta('timeline', {
        state: TIMELINE_ANIMATE,
      });
    }
  }

  render({rect, animation = {}, meta, setEditorMeta}) {
    console.log(this.props, this.state);
    const walk = function*(rects) {
      for (const rect of rects) {
        if (rect.name) {
          yield rect;
        }
        yield* walk(rect.children);
      }
    };

    const named = [...walk([rect])];
    if (named[0] !== rect) {
      named.unshift(rect);
    }

    const toggleBegin = () => {
      this.props.setEditorMeta('timeline', {
        state: this.props.meta.state !== TIMELINE_SET_BEGIN ? TIMELINE_SET_BEGIN : TIMELINE_ANIMATE,
      });
    };
    const toggleEnd = () => {
      this.props.setEditorMeta('timeline', {
        state: this.props.meta.state !== TIMELINE_SET_END ? TIMELINE_SET_END : TIMELINE_ANIMATE,
      });
    };

    return (
      <div style={{position: 'relative', height: '100%', overflow: 'scroll'}}>
        <div style={{position: 'absolute', top: 0, left: 0, right: '80%', overflowY: 'scroll', overflowX: 'hidden'}}>
          <KeyframeHeader meta={meta} toggleBegin={toggleBegin} toggleEnd={toggleEnd} />
          {named.map(named => <BoxHeader rect={named} animated={animation[named.name]} />)}
        </div>
        <div style={{position: 'absolute', top: 0, left: '20%', minWidth: '80%', overflow: 'scroll'}}>
          {(meta.state !== void 0 || meta.state !== TIMELINE_NEUTRAL) ? <Duration duration={meta.animation ? meta.animation.duration : 0} /> : null}
          {(meta.state === TIMELINE_ANIMATE_KEY || meta.state === TIMELINE_MOVE_FRAME) ? <Cursor cursor={meta.cursor} /> : null}
          <KeyframeBody setCursor={this.setCursor} />
          {named.map(named => <BoxBody rect={named} animated={animation[named.name]} />)}
        </div>
      </div>
    )
  }
}

export default Timeline;
