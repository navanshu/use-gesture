import React from 'react'

const withGesture = Wrapped =>
    class extends React.Component {
        state = {
            x: 0,
            y: 0,
            xDelta: 0,
            yDelta: 0,
            xInitial: 0,
            yInitial: 0,
            xPrev: 0,
            yPrev: 0,
            down: false
        }

        // Touch handlers
        handleTouchStart = e => {
            window.addEventListener('touchmove', this.handleTouchMove)
            window.addEventListener('touchend', this.handleTouchEnd)
            this.handleDown(e.touches[0])
        }
        handleTouchMove = e => {
            this.handleMove(e.touches[0])
        }
        handleTouchEnd = () => {
            window.removeEventListener('touchmove', this.handleTouchMove)
            window.removeEventListener('touchend', this.handleMouseUp)
            this.handleUp()
        }

        // Mouse handlers
        handleMouseDown = e => {
            window.addEventListener('mousemove', this.handleMouseMoveRaf)
            window.addEventListener('mouseup', this.handleMouseUp)
            this.handleDown(e)
        }
        handleMouseMove = ({ pageX, pageY }) => {
            if (!this._busy) {
                requestAnimationFrame(() => {
                    this.handleMove({
                        pageX,
                        pageY
                    })
                })
                this._busy = true
            }
        }
        handleMouseUp = () => {
            window.removeEventListener('mousemove', this.handleMouseMove)
            window.removeEventListener('mouseup', this.handleMouseUp)
            this.handleUp()
        }

        // Common handlers
        handleDown = ({ pageX, pageY }) => {
            const newProps = {
                ...this.state,
                x: pageX,
                y: pageY,
                xDelta: 0,
                yDelta: 0,
                xInitial: pageX,
                yInitial: pageY,
                xPrev: pageX,
                yPrev: pageY,
                down: true
            }
            this.setState(
                this.props.onDown ? this.props.onDown(newProps) : newProps
            )
        }
        handleMove = ({ pageX, pageY }) => {
            const newProps = {
                ...this.state,
                x: pageX,
                y: pageY,
                xDelta: pageX - this.state.xInitial,
                yDelta: pageY - this.state.yInitial,
                xPrev: this.state.x,
                yPrev: this.state.y,
                xVelocity: pageX - this.state.x,
                yVelocity: pageY - this.state.y
            }
            this.setState(
                this.props.onMove ? this.props.onMove(newProps) : newProps,
                () => (this._busy = false)
            )
        }
        handleUp = () => {
            const newProps = {
                ...this.state,
                down: false
            }
            this.setState(
                this.props.onUp ? this.props.onUp(newProps) : newProps
            )
        }

        render() {
            const { style, className, ...props } = this.props
            return (
                <div
                    onMouseDown={this.handleMouseDown}
                    onTouchStart={this.handleTouchStart}
                    style={{ display: 'contents', ...style }}
                    className={className}
                >
                    <Wrapped {...props} {...this.state} />
                </div>
            )
        }
    }

const Gesture = withGesture(
    class extends React.PureComponent {
        render() {
            return this.props.children(this.props)
        }
    }
)

export { withGesture, Gesture }
