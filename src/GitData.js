import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import humanNumber from 'human-number'
TimeAgo.addDefaultLocale(en)
const timeAgo = new TimeAgo('en-US')
//--- A function to get the data from the git list items object, and return not found if there's no value
function data (e, k) {
  if (k.length > 0) if (e[k] !== null) if (e[k] !== undefined) return e[k]
  return '*' + k.charAt(0).toUpperCase() + k.slice(1) + ' Was Not Found*'
}

var itemsTemp = []
async function GitData (pageNum) {
  return await fetch(
    'https://api.github.com/search/repositories?q=created:>2017-10-22&sort=stars&order=desc' +
      pageNum,
    {
      headers: {
        authorization: 'token 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'
      }
    }
  )
    .then(res => res.json())
    .then(
      r => {
        if (r.items !== undefined) {
          r.items.forEach(e => {
            itemsTemp.push(
              <div className='repo' key={e.id}>
                <div className='avatar'>
                  <img
                    src={data(e.owner, 'avatar_url')}
                    alt={data(e.owner, 'login')}
                  />
                </div>
                <div className='repo-details'>
                  <h1>{data(e, 'name')}</h1>
                  <p>{data(e, 'description')}</p>
                  <div>
                    <span>
                      Stars: {humanNumber(data(e, 'stargazers_count'))}
                    </span>
                    <span>Issues: {humanNumber(data(e, 'open_issues'))}</span>
                    <small>
                      Submitted{' '}
                      {timeAgo.format(new Date(data(e, 'created_at'))) +
                        ' By ' +
                        data(e.owner, 'login')}
                    </small>
                  </div>
                </div>
              </div>
            )
          })
        }
        //--- Removing Duplicates
        itemsTemp.reduce((unique, o) => {
          if (!unique.some(obj => String(obj.key) === String(o.key))) {
            unique.push(o)
          }
          return unique
        }, [])

        //   if (itemsCount > itemsCountTemp) {
        //     scroll = true

        //     itemsCountTemp = itemsTemp.length
        //   }
        return itemsTemp
        //   itemsCount = itemsTemp.length
      },
      e => {
        console.log(e)
        return false
        //   document.getElementById('loading').innerHTML = '*No More Repos*'
      }
    )
}
export default GitData
