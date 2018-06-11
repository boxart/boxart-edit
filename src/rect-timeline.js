import {h, Component} from 'preact';

import Animation from './animation';

import BoxTypes from './box-types';

class KeyframeEdit extends Component {
  componentDidMount() {
    this.componentDidUpdate();
  }

  componentDidUpdate() {
    const cellHeight = this.base.parentNode.clientHeight;
    console.log(`${cellHeight}px`);
    this.base.style.left = `${cellHeight}px`;
  }

  dropClicks() {
    event.stopPropagation();
    return false;
  }

  render() {
    return (
      <div
        onClick={this.dropClicks}
        style={{position: 'absolute', display: 'inline-block', background: 'rgba(255,255,255,0.8)', whiteSpace: 'nowrap'}}>
        <label><input type="text" /></label>
        <label title="transition"><input type="radio" />T</label>
        <label title="animation"><input type="radio" />A</label>
      </div>
    );
  }
}

class Keyframe extends Component {
  constructor(...args) {
    super(...args);

    this.onDoubleClick = this.onDoubleClick.bind(this);
  }

  componentDidMount() {
    this.componentDidUpdate();
  }

  componentDidUpdate() {
    const position = this.props.keyframe.time;
    const cellHeight = this.base.clientHeight - 2;
    this.base.style.width = `${cellHeight + 2}px`;
    this.base.style.left = `${cellHeight * position}px`;
    console.log('componentDidUpdate', 'Keyframe', position, cellHeight)
  }

  onDoubleClick(event) {
    this.props.removeFrame(this.props.keyframe.time);
    event.preventDefault();
    event.stopPropagation();
    return false;
  }

  render() {
    return (
      <div
        onDblClick={this.onDoubleClick}
        style={{position: 'absolute', background: 'black'}}>
        &nbsp;
        {this.props.cursor === this.props.keyframe.time ?
          <KeyframeEdit
            keyframe={this.props.keyframe}
            changeFrame={this.props.changeFrame} /> :
          null}
      </div>
    );
  }
}

class ValueBody extends Component {
  constructor(...args) {
    super(...args);

    this.onClick = this.onClick.bind(this);
    this.onDoubleClick = this.onDoubleClick.bind(this);
    this.addFrame = this.addFrame.bind(this);
    this.changeFrame = this.changeFrame.bind(this);
    this.removeFrame = this.removeFrame.bind(this);
  }

  onClick(event) {
    const height = event.target.clientHeight - 2;
    let x = event.offsetX / height | 0;
    if (event.target !== this.base) {
      x += event.target.offsetLeft / height | 0;
    }

    this.props.setCursor(x);

    event.preventDefault();
    event.stopPropagation();
    return false;
  }

  onDoubleClick(event) {
    const height = event.target.clientHeight - 2;
    const x = event.offsetX / height | 0;

    this.addFrame(x);
    this.props.setCursor(x);

    event.preventDefault();
    event.stopPropagation();
    return false;
  }

  onMouseDown() {}

  onMouseUp() {}

  onMouseMove() {}

  addFrame(position) {
    this.props.addFrame(this.props.value.name, {
      time: position,
    });
  }

  moveFrame(time, newTime) {
    
  }

  changeFrame(time, frame) {
    
  }

  removeFrame(time) {
    this.props.removeFrame(this.props.value.name, time);
  }

  render({cursor}) {
    return (
      <div
        onClick={this.onClick}
        onDblClick={this.onDoubleClick}
        style={{
          background: `1px center url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><rect x="0" y="0" width="16" height="16" fill="rgba(128,128,128,0.5)" /><rect x="1" y="1" width="14" height="14" fill="#eee" /></svg>')`,
        }}>
        {this.props.value.keyframes && this.props.value.keyframes.map(keyframe => (
          <Keyframe
            cursor={cursor}
            keyframe={keyframe}
            changeFrame={this.changeFrame}
            removeFrame={this.removeFrame} />
        ))}
        &nbsp;
      </div>
    );
  }
}

class ValueHeader extends Component {
  constructor(...args) {
    super(...args);

    this.onDoubleClick = this.onDoubleClick.bind(this);
  }

  onDoubleClick(event) {
    console.log('ValueHeader.onDoubleClick')
    this.props.removeProperty(this.props.value.name);
  }

  render({value: {name}}) {
    console.log('render', arguments);
    return (
      <div style={{position: 'relative'}} onDblClick={this.onDoubleClick}>
        <span>{name}&nbsp;</span>
      </div>
    );
  }
}

class BoxBody extends Component {
  constructor(...args) {
    super(...args);

    this.addFrame = this.addFrame.bind(this);
    this.changeFrame = this.changeFrame.bind(this);
    this.removeFrame = this.removeFrame.bind(this);
  }

  addFrame(propertyName, frame) {
    this.props.addFrame(this.props.animated.name, propertyName, frame);
  }

  changeFrame(propertyName, time, frame) {
    this.props.changeFrame(this.props.animated.name, propertyName, time, frame);
  }

  removeFrame(propertyName, time) {
    this.props.removeFrame(this.props.animated.name, propertyName, time);
  }

  render({cursor, rect, animated = []}) {
    const type = BoxTypes[rect.type] || BoxTypes.Box;
    const valued = [
      {key: 'x'}, {key: 'y'}, {key: 'width'}, {key: 'height'},
      ...(Object.keys(type.rectTypes || {}).map(key => ({key})))
    ];
    return (
      <div style={{minWidth: '100%'}}>
        <div style={{
          minWidth: '100%',
          background: '#eee',
        }}>&nbsp;</div>
        {animated.properties && valued
          .map(value => animated.properties.find(property => value.key === property.name))
          .filter(Boolean)
          .map(animate => (
            <ValueBody
              cursor={cursor}
              value={animate}
              addFrame={this.addFrame} changeFrame={this.changeFrame} removeFrame={this.removeFrame}
              setCursor={this.props.setCursor} />
          ))}
        <div style={{
          minWidth: '100%',
          background: '#eee',
        }}>&nbsp;</div>
      </div>
    );
  }
}

class BoxHeader extends Component {
  constructor(...args) {
    super(...args);

    this.addProperty = this.addProperty.bind(this);
    this.removeProperty = this.removeProperty.bind(this);
  }

  addProperty(event) {
    const rect = this.props.rect;
    event.target.value && this.props.addProperty(rect.name, event.target.value);
  }

  removeProperty(propertyName) {
    this.props.removeProperty(this.props.rect.name, propertyName);
  }

  render({rect, animated = []}) {
    const type = BoxTypes[rect.type] || BoxTypes.Box;
    const valued = [
      {key: 'x'}, {key: 'y'}, {key: 'width'}, {key: 'height'},
      ...(Object.keys(type.rectTypes || {}).map(key => ({key})))
    ];
    console.log(valued, animated);
    return (
      <div>
        <div style={{position: 'relative'}}>
          <span>{rect.name || 'root'}</span>
        </div>
        {animated.properties && valued
          .map(value => animated.properties.find(property => value.key === property.name))
          .filter(Boolean)
          .map(animate => <ValueHeader value={animate} removeProperty={this.removeProperty} />)}
        <div style={{height: '1em', overflow: 'hidden'}}>
          <select onChange={this.addProperty}>
            <option>-----</option>
            {valued.map(value => <option value={value.key}>{value.key}</option>)}
          </select>
          &nbsp;
        </div>
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

class AnimationOptions extends Component {
  constructor(...args) {
    super(...args);

    this.changeDuration = this.changeDuration.bind(this);
  }

  changeDuration(event) {
    this.props.changeDuration(Number(event.target.value));
  }

  render({meta}) {
    return (
      <div style={{background: 'white'}}>
        <div><label>duration<input
          type="text" value={meta.animation && meta.animation.duration}
          onChange={this.changeDuration} />
        </label></div>
        <div><label><input type="radio" name="transitionSetState" /><input type="checkbox" checked="" disabled="true" />transition start</label></div>
        <div><label><input type="radio" name="transitionSetState" /><input type="checkbox" checked="" disabled="true" />transition stop</label></div>
        <div><label><input type="radio" name="transitionSetState" />preview</label></div>
      </div>
    );
  }
}

class AnimationOptionsToggle extends Component {
  constructor(...args) {
    super(...args);

    this.toggleOptions = this.toggleOptions.bind(this);
  }

  toggleOptions() {
    this.props.toggleOptions();
  }

  render({showOptions, meta, changeDuration}) {
    return (
      <span style={{position: 'absolute', right: 0}}>
        <div style={{textAlign: 'right'}} onClick={this.toggleOptions}>
          []
        </div>
        {showOptions ? <AnimationOptions meta={meta} changeDuration={changeDuration} /> : null}
      </span>
    );
  }
}

class KeyframeHeader extends Component {
  render({meta, toggleOptions, changeDuration}) {
    return (
      <div>
        <div>&nbsp;</div>
        <div style={{position: 'fixed', top: 0, left: 0, right: '86.6%', zIndex: 10}}>
          <AnimationOptionsToggle meta={meta} showOptions={meta.showOptions} toggleOptions={toggleOptions} changeDuration={changeDuration} />
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
    console.log(this.base.parentNode.children[2]);
    this.base.style.width = `${cellHeight * this.props.duration + 2}px`;
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
      }}>&nbsp;</div>
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
    this.setDuration = this.setDuration.bind(this);
    this.toggleOptions = this.toggleOptions.bind(this);
    this.addProperty = this.addProperty.bind(this);
    this.removeProperty = this.removeProperty.bind(this);
    this.addFrame = this.addFrame.bind(this);
    this.changeFrame = this.changeFrame.bind(this);
    this.removeFrame = this.removeFrame.bind(this);
  }

  componentWillReceiveProps(props) {
    console.log(props.meta.animation);
    switch (this.props.meta.state) {
    case void 0:
    case TIMELINE_NEUTRAL:
      if (props.meta.animation === void 0) {
        this.props.setEditorMeta('timeline', {
          // beginRect: props.rect,
          // endRect: props.rect,
          animation: new Animation(),
          showOptions: false,
        });
      }
      break;
    case TIMELINE_ANIMATE:
      // if (props.meta.state === 'TIMELINE_SET_BEGIN') {
      //   this.props.updateRect(this.props.meta.beginRect);
      // }
      // if (props.meta.state === 'TIMELINE_SET_END') {
      //   this.props.updateRect(this.props.meta.endRect);
      // }
      break;
    case TIMELINE_ANIMATE_KEY:
      // if (props.meta.state === 'TIMELINE_SET_BEGIN') {
      //   this.props.updateRect(this.props.meta.beginRect);
      //   break;
      // }
      // if (props.meta.state === 'TIMELINE_SET_END') {
      //   this.props.updateRect(this.props.meta.endRect);
      //   break;
      // }

      // if past current duration, set new duration and lastRect

      // rects that changed
      // changed rects with names
      // create or update frames
      // updateAnimation({...})
      break;
    }
  }

  setCursor(x) {
    if (!this.props.meta.animation || x > this.props.meta.animation.duration) {
      return;
    }
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

  setDuration(duration) {
    console.log(duration);
    this.props.setEditorMeta('timeline', {
      animation: this._getAnimation().assign({
        duration,
      }),
    });
  }

  toggleOptions() {
    this.props.setEditorMeta('timeline', {
      showOptions: !this.props.meta.showOptions,
    });
  }

  _getAnimation() {
    return this.props.meta.animation || new Animation();
  }

  addProperty(boxName, propertyName) {
    console.log('addProperty', boxName, propertyName);
    this.props.setEditorMeta('timeline', {
      animation: this._getAnimation().addProperty(boxName, propertyName)
    });
  }

  removeProperty(boxName, propertyName) {
    this.props.setEditorMeta('timeline', {
      animation: this._getAnimation().removeProperty(boxName, propertyName)
    });
  }

  addFrame(boxName, propertyName, frame) {
    this.props.setEditorMeta('timeline', {
      animation: this._getAnimation().addFrame(boxName, propertyName, frame)
    });
  }

  changeFrame(boxName, propertyName, time, frame) {
    this.props.setEditorMeta('timeline', {
      animation: this._getAnimation().changeFrame(boxName, propertyName, time, frame)
    });
  }

  removeFrame(boxName, propertyName, time) {
    this.props.setEditorMeta('timeline', {
      animation: this._getAnimation().removeFrame(boxName, propertyName, time)
    });
  }

  render({rect, meta, setEditorMeta}) {
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

    const {animation = {boxes: []}} = meta || {};
    console.log(animation);

    return (
      <div style={{position: 'relative', height: '100%', overflow: 'scroll'}}>
        <div style={{position: 'absolute', top: 0, left: 0, right: '80%', overflowY: 'scroll', overflowX: 'hidden'}}>
          <KeyframeHeader meta={meta}
            toggleOptions={this.toggleOptions}
            changeDuration={this.setDuration} />
          {named.map(named => (
            <BoxHeader
              rect={named}
              animated={animation.boxes.find(box => box.name === named.name)}
              addProperty={this.addProperty}
              removeProperty={this.removeProperty} />
          ))}
        </div>
        <div style={{position: 'absolute', top: 0, left: '20%', minWidth: '80%', overflow: 'scroll'}}>
          {(meta.state !== void 0 || meta.state !== TIMELINE_NEUTRAL) ? <Duration duration={meta.animation ? meta.animation.duration : 30} /> : <Duration duration={30} />}
          {(meta.state === TIMELINE_ANIMATE_KEY || meta.state === TIMELINE_MOVE_FRAME) ? <Cursor cursor={meta.cursor} /> : <Cursor cursor={-1} />}
          <KeyframeBody setCursor={this.setCursor} />
          {named.map(named => (
            <BoxBody
              cursor={meta.state === TIMELINE_ANIMATE_KEY ? meta.cursor : -1}
              rect={named}
              animated={animation.boxes.find(box => box.name === named.name)}
              addFrame={this.addFrame}
              changeFrame={this.changeFrame}
              removeFrame={this.removeFrame}
              setCursor={this.setCursor} />
          ))}
        </div>
      </div>
    )
  }
}

export default Timeline;
