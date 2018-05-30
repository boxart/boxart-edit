import {h, Component} from 'preact';

class Row extends Component {
  render({rect, index, selectRect}) {
    return (
      <div onClick={e => e.target === this.base && selectRect()}>
        {index}
        <div style={{paddingLeft: '1em'}}>
          {rect.children.map((child, index) => (
            <Row key={index} rect={child} index={index} selectRect={selectRect.bind(null, index)} />
          ))}
        </div>
      </div>
    )
  }
}

class Root extends Component {
  render({rect, selectRect}) {
    return (
      <div
        onClick={e => e.target === this.base && selectRect()}
        onCopy={event => event.clipboardData.setData('text/plain', JSON.stringify(rect))}>
        ~root
        <div style={{paddingLeft: '1em'}}>
          {rect.children.map((child, index) => (
            <Row key={index} rect={child} index={index} selectRect={selectRect.bind(null, index)} />
          ))}
        </div>
      </div>
    );
  }
}

class RectHierarchy extends Component {
  render({rect, pasteMode, changePasteMode, resetRect, selectRect}) {
    return (
      <div>
        <div onClick={resetRect}>Reset</div>
        <div onClick={changePasteMode}>Mode: Copy / {pasteMode === 'paste' ? 'Paste' : 'Overwrite'}</div>
        <Root rect={rect} selectRect={selectRect} />
      </div>
    );
  }
}

export default RectHierarchy;
