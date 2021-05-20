import { useState, useEffect } from 'react'
import GitData from './GitData'

//--- Global variables
var itemsCount = 0,
  itemsCountTemp = 0,
  itemsTemp = []
var page = 1
var scroll = true
export default function Items (props) {
  var [items, setItems] = useState([])
  const get_data = () => {
    var pageNum = ''
    //--- If the numer of pages needed is greater than 1, and also the git list items count is more than 0
    if (page > 1 && itemsCount > 0) pageNum = '&page=' + page
    GitData(pageNum).then(t => {
      if (t) {
        if (t.length > itemsCountTemp) {
          scroll = true

          itemsCountTemp = itemsTemp.length
        }
        itemsTemp = t

        setItems([...itemsTemp])
        itemsCount = itemsTemp.length
        console.log(
          'get data of page:',
          page,
          ', number of elements:',
          itemsCount
        )
      } else console.log(t)
    })
  }
  //--- Initialize the data and scroll event once, when component loads
  useEffect(() => {
    //--- If the scroll is at the last 15% of the page, get more results (increase page value by 1)
    function get_more (e) {
      var windowHeight =
        window.innerHeight || document.documentElement.clientHeight
      if (
        window.scrollY >=
          document.body.scrollHeight -
            document.body.scrollHeight * 0.15 -
            windowHeight &&
        scroll
      ) {
        page = page + 1
        get_data()
        scroll = false
      }
    }
    get_data()
    document.addEventListener('wheel', get_more)
    return () => {
      document.removeEventListener('wheel', get_more)
    }
  }, [])
  return (
    <div className='App'>
      {items}
      <div id='loading'>Loading...</div>
      <br />
    </div>
  )
}
