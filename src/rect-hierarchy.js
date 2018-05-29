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

class RectHierarchy extends Component {
  render({rect, selectRect}) {
    return (
      <div onClick={e => e.target === this.base && selectRect()}>
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

export default RectHierarchy;
