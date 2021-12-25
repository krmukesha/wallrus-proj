import Typography from '@material-ui/core/Typography';

const LoadingView = ({ classes, loading }) => (<div style={loading ? { display: 'block' } : { display: 'none' }} className={classes.loadingMessage}>
  <span role='img' aria-label='emoji' style={{ fontSize: 58, textAlign: 'center', display: 'inline-block', width: '100%' }}>👋</span>
  <Typography variant="h6">
    Waiting for input
  </Typography>
</div>)

export default LoadingView