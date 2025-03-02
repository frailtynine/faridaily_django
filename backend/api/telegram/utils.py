def combine_graphs(new_graph, old_graph) -> dict:
    """
    Combines two graphs with 'x_axis' and 'y_axis' keys.
    'x_axis' is sorted from high to low, unique numbers.

    If the last element of the 'x_axis' in the new graph is the same as
    the last element of the 'x_axis' in the old graph, the old graph
    is returned unchanged.

    Otherwise, it finds the point in the new graph where the 'x_axis'
    value is less than or equal to the last 'x_axis' value of the old graph,
    and combines the graphs from that point onward.

    Args:
        new_graph (dict): 'x_axis' and 'y_axis' keys.
        old_graph (dict): 'x_axis' and 'y_axis' keys.

    Returns:
        dict: A dictionary representing the combined graph 
        with updated 'x_axis' and 'y_axis' values.
    """
    if not new_graph:
        raise ValueError('Telegram returned an empty graph.')
    if not old_graph:
        raise ValueError('Graph from database is empty.')
    if (
        not new_graph["x_axis"]
        or not new_graph["y_axis"]
        or not old_graph["x_axis"]
        or not old_graph["y_axis"]
    ):
        raise ValueError(
            "Both graphs must contain 'x_axis' and 'y_axis' lists."
        )

    if new_graph["x_axis"][-1] == old_graph["x_axis"][-1]:
        return old_graph
    for i in range(len(new_graph["x_axis"]) - 1, -1, -1):
        if new_graph["x_axis"][i] <= old_graph["x_axis"][-1]:
            combined_graph = {
               "x_axis": old_graph["x_axis"] + new_graph["x_axis"][i + 1:],
               "y_axis": old_graph["y_axis"] + new_graph["y_axis"][i + 1:]
            }
            if len(combined_graph["x_axis"]) != len(combined_graph["y_axis"]):
                raise ValueError("Axises of graph do not match.")
            return combined_graph


def get_reactions_count(reactions_list):
    """Counts reactions from Message instance.

    Accepts Message.reactions.results.
    Returns int.
    """
    result = 0
    if not reactions_list:
        return result
    for reaction in reactions_list:
        result += reaction.count
    return result


def prepare_html_for_tg(text: str) -> str:
    """
    Replaces <p> tags with new lines and
    <mark> with <tg-spoiler> for telegram-friendly text.
    """

    return text.replace(
        '<p></p>', '\n'
    ).replace(
        '<p>', '\n'
    ).replace('</p>', '\n')
