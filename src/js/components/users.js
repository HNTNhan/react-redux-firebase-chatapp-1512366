import { compose } from 'redux'
import { connect } from 'react-redux'
import { firebaseConnect, getVal } from 'react-redux-firebase'

const enhance = compose(
    firebaseConnect((props) => ([
            `posts/${props}` // sync /posts/postId from firebase into redux
        ]),
        connect((state, props) => ({
                post: getVal(state.firebase.data, `posts/${props}`),
            })
        )
    )
);

const Post = ({ post }) => (
    console.log(post)
);

export default enhance(Post)