/***
 * character upload route
 */
// modules
const fs = require("fs");
const char = require("./main");

module.exports = async function (req, res, url) {
	if (req.method != "POST" || url.pathname != "/upload_character")
		return;

	const formidable = await import("formidable");

	new formidable.IncomingForm().parse(req, (e, f, files) => {
		console.log(files.import[0].filepath);
		const path = files.import[0].filepath, buffer = fs.readFileSync(path);
		const meta = {
			type: "char",
			subtype: 0,
			title: "Untitled",
			ext: "xml",
			tId: char.getTheme(buffer)
		};
		try {
			// save the char
			const id = char.save(buffer, meta);
			const url = `/cc?themeId=family&original_asset_id=${id}`;
			fs.unlinkSync(path);
			// redirect the user
			res.statusCode = 302;
			res.setHeader("Location", url);
			res.end();
		} catch (err) {
			console.error("Error uploading character: " + err);
			res.statusCode = 500;
			res.end("00");
		}
	});
	return true;
}
