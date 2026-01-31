const dummy = (blogs) => {
	return 1
}

// Calculate the total number of likes for an array of blog posts
const totalLikes = (blogs) => {
	return blogs.reduce((sum, blog) => sum + (blog.likes || 0), 0)
}

const favoriteBlog = (blogs) => {
	if (!blogs || blogs.length === 0) return null

	const fav = blogs.reduce((favorite, blog) => (favorite.likes >= blog.likes ? favorite : blog))

	return {
		title: fav.title,
		author: fav.author,
        url: fav.url,
		likes: fav.likes
	}
}

module.exports = { dummy, totalLikes, favoriteBlog }