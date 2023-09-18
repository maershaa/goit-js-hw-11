function createMarkup(arr) {
  return arr
    .map(
      ({
        webformatURL,
        largeImageURL, // ссылка на большое изображение.
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `
<div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" width=600 height=380 loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>${likes} Likes</b>
    </p>
    <p class="info-item">
      <b>${views} Views</b>
    </p>
    <p class="info-item">
      <b>${comments} Comments</b>
    </p>
    <p class="info-item">
      <b>${downloads} Downloads</b>
    </p>
  </div>
</div>`
    )
    .join('');
}

export { createMarkup };
