import { LINKS_PER_PAGE, AUTH_TOKEN } from "../constants";
import { timeDifferenceForDate } from "../utils";
import { useMutation, gql } from "@apollo/client";

const Link = (props) => {
  const { link } = props;
  const authToken = localStorage.getItem(AUTH_TOKEN);

  const take = LINKS_PER_PAGE;
  const skip = 0;
  const orderBy = { createdBy: "desc" };

  const VOTE_MUTATION = gql`
    mutation VoteMutation($linkId: ID!) {
      vote(linkId: $linkId) {
        id
        link {
          id
          votes {
            id
            user {
              id
            }
          }
        }
        user {
          id
        }
      }
    }
  `;

  const [vote] = useMutation(VOTE_MUTATION, {
    variables: {
      linkId: link.id,
    },
  });

  return (
    <div className="flex mt2 items-start">
      <div className="flex items-center">
        <span className="gray">{props.index + 1}.</span>
        {authToken && (
          <div
            className="ml1 gray fl1"
            style={{ cursor: "pointer" }}
            onClick={vote}
          >
            ▲
          </div>
        )}
        <div className="ml1">
          <div>
            {link.description}({link.url})
          </div>
          {authToken && (
            <div className="f6 lh-copy gray">
              {link.votes.length} votes | by{" "}
              {link.postedBy ? link.postedBy.name : "unknown"}{" "}
              {timeDifferenceForDate(link.createdAt)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Link;
