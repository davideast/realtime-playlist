/** @jsx React.DOM */

var React = require('react');

var Popover = React.createClass({

  render: function() {

    var style = {
      top: this.props.topOffset,
      left: this.props.leftOffset,
      display: this.props.display,
      color: '#000'
    };

    return (
      <div className="popover fade right in" role="tooltip" style={style}>
        <div className="arrow"></div>
        <h3 className="popover-title">this.props.title</h3>
        <div className="popover-content">
          this.props.message
        </div>
      </div>
    );
  }

});

module.exports = Popover;
